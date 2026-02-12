# Skills, MCP, and Evaluation Guidance - Content Ideation

## Overview

This PR addresses **GTM-1840** by providing comprehensive ideation on content pieces for skills, MCP (Model Context Protocol), and evaluation guidance for teams building internal agent capabilities.

## Problem Statement

Manas from Intuit (and likely many other teams) needs guidance on:
- What "skills" are in the context of AI agents
- How skills relate to MCP
- How to engineer and evaluate skills that teams create internally
- Best practices for building robust, production-ready agent capabilities

## What's in This PR

A comprehensive ideation document (`IDEATION-skills-mcp-evaluation.md`) that explores **8 different content angles**:

### 1. 🎯 Definitive Conceptual Guide
Clarifies what skills are, how they differ from MCP, and when to use each approach.

### 2. 🔬 Engineering Best Practices Guide
Technical deep dive on building production-ready skills with code examples.

### 3. 📊 Evaluation Framework Guide ⭐ **RECOMMENDED**
Systematic approach to testing and evaluating skills (directly answers the Linear issue).

### 4. 🏢 Team Workflow & Process Guide
Governance, process, and collaboration patterns for scaling skills development.

### 5. 🎓 Interactive Tutorial/Cookbook
Hands-on, step-by-step guide with working code examples.

### 6. 🔄 Skills & MCP Comparison Guide
Decision framework for choosing between skills, MCP, and function calling.

### 7. 📈 Skills Maturity Model
Framework for teams to assess and improve their skills practice.

### 8. 🔍 Case Studies Collection
Real-world examples from leading teams.

## Recommended Approach

### Phase 1: Foundation (Immediate - 2-3 weeks)
Start with:
- **Angle 1**: Conceptual Guide (establish vocabulary)
- **Angle 6**: Comparison Guide (help teams decide)

### Phase 2: Practical Implementation (3-4 weeks)
Follow with:
- **Angle 3**: Evaluation Framework ⭐ (directly answers GTM-1840)
- **Angle 5**: Interactive Tutorial (hands-on learning)

### Phase 3: Scaling (4-5 weeks)
- **Angle 2**: Engineering Guide
- **Angle 4**: Team Workflow

### Phase 4: Thought Leadership (Future)
- **Angle 7**: Maturity Model
- **Angle 8**: Case Studies

## Key Highlights

✅ **Builds on existing content**: Links to agent evaluation guide, MCP server blog, etc.  
✅ **Multiple formats**: Documentation, blog posts, Jupyter notebooks, videos  
✅ **Practical & actionable**: Not just theory, includes code examples and frameworks  
✅ **Integrates with Langfuse**: Shows how to use Langfuse for tracing and evaluation  
✅ **Addresses real needs**: Based on customer request from Intuit

## Content Structure Proposed

```
Skills & MCP Hub (new landing page)
├── What are Skills? (Angle 1)
├── Skills vs MCP Decision Guide (Angle 6)
├── Engineering Skills Guide (Angle 2)
├── Evaluating Skills Guide (Angle 3) ⭐
├── Skills Tutorial (Angle 5)
├── Team Workflows (Angle 4)
└── Related:
    ├── Agent Evaluation Guide (existing)
    ├── MCP Server Blog (existing)
    └── OpenAI Agents Cookbook (existing)
```

## Resource Requirements

- **Phase 1**: ~100 hours (2-3 weeks)
- **Phase 2**: ~120 hours (3-4 weeks)
- **Phase 3**: ~115 hours (4-5 weeks)

## Next Steps

1. **Review & discuss** these angles with the team
2. **Prioritize** which content pieces to create first
3. **Validate** with customers (Manas/Intuit) on their needs
4. **Create detailed outlines** for chosen angles
5. **Begin content development**

## Questions for Discussion

1. Which angles resonate most with our target audience?
2. Should we start with Angle 3 (Evaluation) or Angle 1 (Conceptual)?
3. Do we have teams we can interview for case studies?
4. What frameworks should we prioritize? (OpenAI, Anthropic, LangChain, Pydantic AI?)
5. Should this be open source / community-driven?

## References

- **Linear Issue**: GTM-1840
- **External**: OpenAI eval-skills blog, Anthropic blog posts
- **Internal**: Agent evaluation guide, MCP server blog, OpenAI agents cookbook

---

**Ready for review!** Looking forward to feedback on which angles to pursue and in what order.
