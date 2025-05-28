import nbformat as nbf
import json
import os

def create_notebook(cells=None, metadata=None):
    """
    Create a new Jupyter notebook with the given cells and metadata.
    
    Args:
        cells (list): List of cell dictionaries
        metadata (dict): Notebook metadata
    
    Returns:
        nbformat.notebooknode.NotebookNode: The created notebook
    """
    if cells is None:
        cells = []
    if metadata is None:
        metadata = {
            "kernelspec": {
                "display_name": "Python 3",
                "language": "python",
                "name": "python3"
            },
            "language_info": {
                "codemirror_mode": {
                    "name": "ipython",
                    "version": 3
                },
                "file_extension": ".py",
                "mimetype": "text/x-python",
                "name": "python",
                "nbconvert_exporter": "python",
                "pygments_lexer": "ipython3",
                "version": "3.8.0"
            }
        }
    
    nb = nbf.v4.new_notebook(metadata=metadata)
    nb.cells = cells
    return nb

def add_code_cell(notebook, source, execution_count=None):
    """
    Add a code cell to the notebook.
    
    Args:
        notebook: The notebook to add the cell to
        source (str): The source code
        execution_count (int): The execution count
    """
    cell = nbf.v4.new_code_cell(source=source, execution_count=execution_count)
    notebook.cells.append(cell)

def add_markdown_cell(notebook, source):
    """
    Add a markdown cell to the notebook.
    
    Args:
        notebook: The notebook to add the cell to
        source (str): The markdown text
    """
    cell = nbf.v4.new_markdown_cell(source=source)
    notebook.cells.append(cell)

def save_notebook(notebook, filename):
    """
    Save the notebook to a file.
    
    Args:
        notebook: The notebook to save
        filename (str): The output filename
    """
    with open(filename, 'w', encoding='utf-8') as f:
        nbf.write(notebook, f)

def load_notebook(filename):
    """
    Load a notebook from a file.
    
    Args:
        filename (str): The notebook filename
    
    Returns:
        nbformat.notebooknode.NotebookNode: The loaded notebook
    """
    with open(filename, 'r', encoding='utf-8') as f:
        return nbf.read(f, as_version=4)

def notebook_to_python(notebook, output_file):
    """
    Convert a notebook to a Python file.
    
    Args:
        notebook: The notebook to convert
        output_file (str): The output Python filename
    """
    with open(output_file, 'w', encoding='utf-8') as f:
        for cell in notebook.cells:
            if cell.cell_type == 'code':
                f.write(cell.source)
                f.write('\n\n')
            elif cell.cell_type == 'markdown':
                f.write('# ' + cell.source.replace('\n', '\n# '))
                f.write('\n\n')

if __name__ == '__main__':
    # Example usage
    nb = create_notebook()
    
    # Add a markdown cell
    add_markdown_cell(nb, "# My Jupyter Notebook\nThis is an example notebook.")
    
    # Add a code cell
    add_code_cell(nb, "# This is a simple code cell\nprint('Hello, World!')")
    
    # Save the notebook
    save_notebook(nb, 'example.ipynb') 