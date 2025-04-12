import requests
import json
import os
import csv
from datetime import datetime, timezone
import xml.dom.minidom as md

def run_query(query, variables):
    url = 'https://api.github.com/graphql'
    token = os.environ.get("GITHUB_ACCESS_TOKEN")
    if not token:
        raise ValueError("GITHUB_ACCESS_TOKEN environment variable is not set. Please set it with your GitHub Personal Access Token.")
    
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json',
    }
    response = requests.post(url, json={'query': query, 'variables': variables}, headers=headers)
    
    if response.status_code == 401:
        raise ValueError("GitHub API returned 401 Unauthorized. Please check if your GITHUB_TOKEN is valid and has the necessary permissions.")
    
    response.raise_for_status()
    return response.json()

def load_github_discussions():
    query = """
    query($owner: String!, $name: String!, $cursor: String) {
      repository(owner: $owner, name: $name) {
        discussions(first: 100, after: $cursor, orderBy: {field: CREATED_AT, direction: DESC}) {
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            number
            title
            url
            createdAt
            updatedAt
            upvoteCount
            comments {
              totalCount
            }
            category {
              name
            }
            author {
              login
              url
            }
            labels(first: 100) {
              nodes {
                name
              }
            }
            answer {
              id
            }
          }
        }
      }
    }
    """
    
    variables = {
        "owner": "langfuse",
        "name": "langfuse",
        "cursor": None
    }
    
    all_discussions = []
    
    while True:
        result = run_query(query, variables)
        discussions = result['data']['repository']['discussions']
        
        for discussion in discussions['nodes']:
            all_discussions.append({
                "number": discussion['number'],
                "title": discussion['title'],
                "href": discussion['url'],
                "created_at": discussion['createdAt'],
                "updated_at": discussion['updatedAt'],
                "upvotes": discussion['upvoteCount'],
                "comment_count": discussion['comments']['totalCount'],
                "resolved": discussion['answer'] is not None,
                "labels": [label['name'] for label in discussion['labels']['nodes']],
                "author": {
                    "login": discussion['author']['login'],
                    "html_url": discussion['author']['url']
                },
                "category": discussion['category']['name']
            })
        
        if not discussions['pageInfo']['hasNextPage']:
            break
        
        variables['cursor'] = discussions['pageInfo']['endCursor']
    
    # Save all discussions to CSV before grouping
    save_discussions_to_csv(all_discussions)
    
    categories = {}
    for discussion in all_discussions:
        category = discussion['category']
        if category not in categories:
            categories[category] = []
        categories[category].append(discussion)
    
    result = {
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "categories": [
            {
                "category": category,
                "discussions": discussions
            } for category, discussions in categories.items()
        ]
    }
    
    return result

def save_discussions_to_csv(discussions, filename="src/langfuse_github_discussions.csv"):
    file_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), filename)
    
    with open(file_path, "w", newline='', encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=[
            "number", "title", "href", "created_at", "updated_at", "upvotes", "comment_count",
            "resolved", "labels", "author_login", "author_url", "category"
        ])
        writer.writeheader()
        for discussion in discussions:
            writer.writerow({
                "number": discussion["number"],
                "title": discussion["title"],
                "href": discussion["href"],
                "created_at": discussion["created_at"],
                "updated_at": discussion["updated_at"],
                "upvotes": discussion["upvotes"],
                "comment_count": discussion["comment_count"],
                "resolved": discussion["resolved"],
                "labels": ", ".join(discussion["labels"]),
                "author_login": discussion["author"]["login"],
                "author_url": discussion["author"]["html_url"],
                "category": discussion["category"]
            })
    
    print(f"Discussions saved to CSV: {file_path}")

def save_discussions_to_json(discussions, filename="src/langfuse_github_discussions.json"):
    file_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), filename)
    
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(discussions, f, indent=2, ensure_ascii=False)
    
    print(f"Discussions saved to {file_path}")

def generate_sitemap(discussions, filename="public/github-discussions-sitemap.xml"):
    """Generate a sitemap XML file with all GitHub discussions for third-party indexing."""
    file_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), filename)
    
    # Create the XML document
    doc = md.getDOMImplementation().createDocument(None, "urlset", None)
    root = doc.documentElement
    root.setAttribute("xmlns", "http://www.sitemaps.org/schemas/sitemap/0.9")
    
    # Add all discussion URLs to the sitemap
    for category in discussions["categories"]:
        for discussion in category["discussions"]:
            url_element = doc.createElement("url")
            
            loc = doc.createElement("loc")
            loc.appendChild(doc.createTextNode(discussion["href"]))
            url_element.appendChild(loc)
            
            lastmod = doc.createElement("lastmod")
            # Use the full ISO 8601 timestamp for lastmod
            updated_date = datetime.fromisoformat(discussion["updated_at"].replace("Z", "+00:00"))
            lastmod.appendChild(doc.createTextNode(updated_date.isoformat()))
            url_element.appendChild(lastmod)
            
            # Add priority based on category and resolution status
            priority = doc.createElement("priority")
            category_name = category["category"]
            is_resolved = discussion["resolved"]
            
            priority_value = "0" # Default priority
            
            if category_name == "Announcements":
                priority_value = "0.9"
            elif category_name == "Ideas":
                priority_value = "0.8"
            elif category_name == "Support" and is_resolved:
                priority_value = "0.8"
            
            # Skip if priority is 0
            if priority_value == "0":
                continue

            priority.appendChild(doc.createTextNode(priority_value))
            url_element.appendChild(priority)
            
            root.appendChild(url_element)
    
    # Create the directories if they don't exist
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    
    # Write the XML to a file with proper formatting
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(doc.toprettyxml(indent="  "))
    
    print(f"Sitemap generated at {file_path}")

if __name__ == "__main__":
    try:
        discussions = load_github_discussions()
        save_discussions_to_json(discussions)
        generate_sitemap(discussions)
    except ValueError as e:
        print(f"Error: {e}")
    except requests.exceptions.RequestException as e:
        print(f"Network error occurred: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
