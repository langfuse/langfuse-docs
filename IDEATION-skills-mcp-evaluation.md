# Skills, MCP, and Evaluation: Content Ideation Document

## Context

This document explores different angles and content pieces for creating guidance on skills, Model Context Protocol (MCP), and how teams should think about engineering and evaluating them.

**Target Audience**: Teams at companies like Intuit building internal agent skills/capabilities  
**Goal**: Provide practical, actionable guidance on what skills are, how they relate to MCP, and how to evaluate them effectively

---

## Background Research

### What We Already Have
- **MCP Server Implementation Blog Post**: Technical deep dive on building production MCP servers
- **MCP Documentation**: Usage docs for Langfuse's MCP servers (docs & data platform)
- **Agent Evaluation Guide**: Comprehensive guide on evaluating LLM agents (3-phase approach)
- **OpenAI Agents SDK Example**: Tracing and evaluation for agents with tools

### What's Missing
- Clear definition of "skills" in the AI agent context
- How skills relate to/differ from MCP tools
- Engineering best practices for skills development
- Evaluation frameworks specifically for skills
- Team workflows for building and maintaining skills
- When to use skills vs. MCP vs. other patterns

### External References
- OpenAI's eval-skills blog post (mentioned in issue)
- Anthropic blog posts on evaluation
- MCP protocol specification

---

## Content Angles

### 🎯 Angle 1: Definitive Conceptual Guide
**Title Options:**
- "Understanding Skills, Tools, and MCP: A Mental Model for AI Agent Capabilities"
- "Skills vs MCP: What's the Difference and When to Use Each"
- "The Agent Capability Stack: Skills, Tools, and MCP Explained"

**Structure:**
1. **Definitions & Taxonomy**
   - What is a "skill" in the context of AI agents?
   - Skills vs. Tools vs. Functions vs. MCP servers
   - The capability hierarchy
   
2. **Conceptual Framework**
   - When to package something as a skill
   - When to use MCP
   - When to use simple function calling
   - Trade-offs between approaches

3. **Architecture Patterns**
   - Monolithic skills vs. atomic tools
   - Composability patterns
   - Dependency management

4. **Real-World Examples**
   - Internal tool access (e.g., JIRA, Slack)
   - Data retrieval capabilities
   - Multi-step workflows as skills

**Strengths:**
- Addresses fundamental confusion about terminology
- Provides mental models for decision-making
- Educational foundation for other content

**Target Length:** 2,500-3,500 words  
**Format:** Documentation page or long-form blog post  
**Estimated Effort:** Medium (requires research & synthesis)

---

### 🔬 Angle 2: Engineering Best Practices Guide
**Title Options:**
- "Building Production-Ready Skills: An Engineering Guide"
- "How to Build, Test, and Deploy Agent Skills at Scale"
- "Skills Engineering: From Prototype to Production"

**Structure:**
1. **Design Principles**
   - Single responsibility for skills
   - Input/output contracts
   - Error handling strategies
   - State management

2. **Development Workflow**
   - Skill scaffolding and templates
   - Local development and testing
   - Integration testing with agents
   - Version control strategies

3. **Technical Implementation**
   - Authentication and authorization
   - Rate limiting and quotas
   - Caching strategies
   - Monitoring and observability

4. **Deployment Patterns**
   - Canary deployments for skills
   - Feature flags
   - Rollback strategies
   - Dependency management

5. **Code Examples**
   - Sample skill implementations
   - Testing frameworks
   - CI/CD pipeline configurations

**Strengths:**
- Directly actionable for engineering teams
- Fills gap in existing content
- Can include code snippets and examples
- Reusable templates

**Target Length:** 3,500-4,500 words  
**Format:** Comprehensive guide with code examples  
**Estimated Effort:** High (requires technical depth + examples)

---

### 📊 Angle 3: Evaluation Framework Guide
**Title Options:**
- "Evaluating Agent Skills: A Systematic Approach"
- "How to Know If Your Skills Actually Work: An Evaluation Framework"
- "Skills Testing: From Unit Tests to Production Monitoring"

**Structure:**
1. **Evaluation Philosophy**
   - Why skills need different evaluation than agents
   - The testing pyramid for skills
   - Metrics that matter

2. **Unit Testing Skills**
   - Testing individual skill logic
   - Mocking external dependencies
   - Contract testing
   - Example test suites

3. **Integration Testing**
   - Testing skills within agent context
   - Multi-skill interactions
   - Error propagation testing
   - Performance testing

4. **Offline Evaluation**
   - Building skill-specific datasets
   - Success criteria definition
   - Regression testing
   - A/B testing frameworks

5. **Online Monitoring**
   - Key metrics (latency, success rate, error rate)
   - User satisfaction signals
   - Cost tracking
   - Alerting strategies

6. **Practical Examples**
   - Dataset creation for common skill types
   - LLM-as-judge for skill outputs
   - Automated evaluation pipelines

**Strengths:**
- Directly addresses the Linear issue question
- Systematic and actionable
- Can integrate with existing Langfuse features
- Includes both code and strategy

**Target Length:** 3,000-4,000 words  
**Format:** Comprehensive guide with code examples  
**Estimated Effort:** Medium-High (builds on existing eval content)

---

### 🏢 Angle 4: Team Workflow & Process Guide
**Title Options:**
- "Building Skills as a Team: Process and Governance"
- "Skills Management at Scale: A Team Playbook"
- "From Request to Production: The Skills Development Lifecycle"

**Structure:**
1. **Skills Governance**
   - Who owns skills?
   - Skills registry and discovery
   - Documentation standards
   - Deprecation policies

2. **Request to Deployment**
   - Intake process for new skills
   - Prioritization frameworks
   - Design review process
   - Approval gates

3. **Collaboration Patterns**
   - Cross-functional skill development
   - Domain expert involvement
   - Documentation requirements
   - Knowledge sharing

4. **Quality Gates**
   - Definition of done for skills
   - Testing requirements
   - Security review
   - Performance benchmarks

5. **Maintenance**
   - Monitoring and alerting ownership
   - Incident response
   - Iterative improvements
   - Sunsetting process

**Strengths:**
- Addresses organizational aspects
- Practical for scaling teams
- Process-oriented (complements technical guides)
- Helps with governance

**Target Length:** 2,000-3,000 words  
**Format:** Guide/playbook  
**Estimated Effort:** Medium (requires interviews/research)

---

### 🎓 Angle 5: Interactive Tutorial/Cookbook
**Title Options:**
- "Building Your First Skill: A Step-by-Step Tutorial"
- "Skills Engineering Cookbook: 5 Common Patterns"
- "From Zero to Hero: Building, Testing, and Deploying Skills"

**Structure:**
1. **Tutorial Format**
   - Build a real skill from scratch
   - Multiple skill types (API wrapper, data retrieval, multi-step)
   - Step-by-step with explanations

2. **Common Patterns**
   - Pattern 1: Simple API wrapper skill
   - Pattern 2: Data transformation skill
   - Pattern 3: Multi-step workflow skill
   - Pattern 4: Context-aware skill
   - Pattern 5: MCP-based skill

3. **Each Pattern Includes:**
   - Use case description
   - Implementation code
   - Testing approach
   - Evaluation strategy
   - Common pitfalls

4. **End-to-End Example**
   - Complete working example
   - Jupyter notebook format
   - Integrated with Langfuse tracing
   - Evaluation dashboard setup

**Strengths:**
- Hands-on and practical
- Can be run as a notebook
- Integrates naturally with Langfuse
- Lowers barrier to entry

**Target Length:** Jupyter notebook with extensive explanations  
**Format:** Cookbook entry  
**Estimated Effort:** High (requires working code + testing)

---

### 🔄 Angle 6: Skills & MCP Comparison Guide
**Title Options:**
- "MCP vs Custom Skills: A Decision Framework"
- "Choosing Between Skills, MCP Servers, and Function Calling"
- "The Agent Capability Toolkit: When to Use What"

**Structure:**
1. **Quick Decision Matrix**
   - Visual flowchart for choosing approach
   - Key decision factors
   - Trade-off table

2. **Deep Dive: MCP Servers**
   - What MCP is best for
   - When to build an MCP server
   - MCP limitations
   - Case studies

3. **Deep Dive: Custom Skills**
   - What custom skills excel at
   - When to build custom
   - Implementation patterns
   - Case studies

4. **Deep Dive: Simple Function Calling**
   - When simple is better
   - Function calling patterns
   - Limitations

5. **Migration Paths**
   - Function → Skill
   - Skill → MCP
   - MCP → Skill

6. **Hybrid Approaches**
   - Combining patterns
   - Orchestration strategies

**Strengths:**
- Clarifies confusion between options
- Decision-focused
- Practical and tactical
- Includes migration guidance

**Target Length:** 2,500-3,500 words  
**Format:** Decision guide with visuals  
**Estimated Effort:** Medium (synthesis of existing knowledge)

---

### 📈 Angle 7: Skills Maturity Model
**Title Options:**
- "The Skills Maturity Model: Evolving Your Agent Capabilities"
- "From Ad-Hoc to Excellence: A Maturity Framework for Skills"
- "Leveling Up Your Skills Practice"

**Structure:**
1. **Level 0: Ad-Hoc**
   - Characteristics
   - Common issues
   - What to do first

2. **Level 1: Basic**
   - Standardized development
   - Basic testing
   - Documentation
   - Next steps

3. **Level 2: Managed**
   - Governance processes
   - Automated testing
   - Monitoring
   - Next steps

4. **Level 3: Optimized**
   - Data-driven improvements
   - A/B testing
   - Advanced evaluation
   - Continuous improvement

5. **Level 4: Excellence**
   - Industry-leading practices
   - Innovation
   - Community contribution

6. **Self-Assessment**
   - Questionnaire
   - Scoring rubric
   - Recommended next actions

**Strengths:**
- Helps teams understand current state
- Provides roadmap for improvement
- Framework for discussion
- Can be revisited over time

**Target Length:** 2,000-2,500 words  
**Format:** Framework guide  
**Estimated Effort:** Medium (requires framework design)

---

### 🔍 Angle 8: Case Studies Collection
**Title Options:**
- "How Leading Teams Build and Evaluate Skills"
- "Skills in Production: 5 Case Studies"
- "Real-World Skills Engineering: Lessons from the Field"

**Structure:**
1. **Case Study Template** (for each):
   - Company/team context
   - Problem statement
   - Skills architecture chosen
   - Implementation details
   - Evaluation approach
   - Results and learnings
   - Mistakes and course corrections

2. **Case Study Ideas:**
   - E-commerce: Product recommendation skill
   - Finance: Data analysis skill
   - Customer support: Ticket triage skill
   - DevOps: Incident response skill
   - HR: Policy lookup skill

3. **Cross-Case Analysis**
   - Common patterns
   - Success factors
   - Pitfalls to avoid
   - Recommendations

**Strengths:**
- Real-world validation
- Stories are engaging
- Multiple contexts shown
- Lessons learned

**Target Length:** 3,000-4,000 words (5 case studies)  
**Format:** Blog post or documentation section  
**Estimated Effort:** Very High (requires interviews/research)

---

## Recommended Content Mix

### Phase 1: Foundation (Immediate)
**Primary**: Angle 1 (Conceptual Guide) + Angle 6 (Comparison Guide)
- Address fundamental confusion
- Help teams make decisions
- Establish shared vocabulary

**Estimated Timeline**: 2-3 weeks

### Phase 2: Practical Implementation (Next)
**Primary**: Angle 3 (Evaluation Framework) + Angle 5 (Tutorial)
- Directly answers the Linear issue
- Provides hands-on experience
- Integrates with Langfuse features

**Estimated Timeline**: 3-4 weeks

### Phase 3: Scaling & Optimization (Future)
**Secondary**: Angle 2 (Engineering Guide) + Angle 4 (Team Workflow)
- Helps teams scale
- Addresses operational challenges
- Enterprise-ready guidance

**Estimated Timeline**: 4-5 weeks

### Phase 4: Thought Leadership (Optional)
**Optional**: Angle 7 (Maturity Model) + Angle 8 (Case Studies)
- Establishes Langfuse as thought leader
- Community building
- Advanced content

**Estimated Timeline**: Ongoing

---

## Integration with Existing Content

### Link to Existing Guides
- Agent evaluation guide (already excellent)
- MCP server implementation blog
- OpenAI agents cookbook
- Prompt management docs

### Create Content Cluster
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

---

## Metrics for Success

### Content Metrics
- Page views and engagement time
- Social shares and citations
- GitHub stars/forks of example code
- Community feedback and questions

### Business Metrics
- Inbound leads mentioning skills/MCP
- Enterprise customer conversations
- Developer community growth
- Search rankings for "agent skills evaluation"

### User Outcomes
- Teams successfully implementing skills
- Reduction in support questions
- Community contributions
- Case studies from users

---

## Open Questions & Research Needed

1. **Terminology**: What do different frameworks call "skills"?
   - OpenAI: Skills
   - Anthropic: Tools
   - LangChain: Tools
   - Others?

2. **Standards**: Are there emerging standards for skill interfaces?

3. **Best Practices**: What are teams actually doing today?
   - Need to conduct interviews
   - Survey existing implementations

4. **Pain Points**: What are the biggest challenges?
   - Discovery
   - Testing
   - Versioning
   - Composition

5. **MCP Adoption**: How widely is MCP being used?
   - Production readiness concerns
   - Alternative approaches

---

## Risks & Considerations

### Technical Risks
- Rapidly evolving space (content may date quickly)
- Different frameworks use different terminology
- No universal standards yet

**Mitigation**: 
- Focus on principles over specific implementations
- Use multiple framework examples
- Create evergreen content with tactical updates

### Content Risks
- Too abstract → not actionable
- Too specific → limited applicability
- Too long → readers don't finish

**Mitigation**:
- Mix conceptual with practical
- Multiple content formats
- Clear TL;DR sections

### Competitive Risks
- Others may publish similar content
- OpenAI/Anthropic may release official guides

**Mitigation**:
- Move quickly on Phase 1
- Focus on Langfuse integration
- Community-driven approach

---

## Resource Requirements

### For Phase 1 (Foundation)
- 1 technical writer/developer: 60-80 hours
- 1 reviewer/editor: 20 hours
- Design for diagrams: 10 hours
- **Total**: ~100 hours over 2-3 weeks

### For Phase 2 (Practical)
- 1 developer for tutorial code: 40 hours
- 1 technical writer: 60 hours
- Testing and validation: 20 hours
- **Total**: ~120 hours over 3-4 weeks

### For Phase 3 (Scaling)
- Technical writer: 80 hours
- Domain experts for interviews: 15 hours
- Review and editing: 20 hours
- **Total**: ~115 hours over 4-5 weeks

---

## Next Steps

### Immediate Actions
1. **Validate approach** with stakeholders (Manas, internal team)
2. **Choose initial angles** (recommend Angle 1 + Angle 3)
3. **Create outline** for first piece
4. **Gather examples** from existing implementations
5. **Set up tracking** for content performance

### Questions to Answer
- What specific frameworks should we cover? (OpenAI, Anthropic, LangChain, Pydantic AI?)
- Do we have access to teams we can interview?
- What's the priority order based on customer requests?
- Should this be open source / community-driven?

### Content Calendar
- Week 1-2: Research & outlines
- Week 3-4: Draft Angle 1 (Conceptual)
- Week 5-6: Draft Angle 3 (Evaluation) or Angle 6 (Comparison)
- Week 7-8: Review, edit, publish
- Week 9+: Gather feedback, iterate

---

## Appendix: Content Formats

### Format Options
1. **Documentation Page**: Structured, searchable, versioned
2. **Blog Post**: Narrative, shareable, time-stamped
3. **Jupyter Notebook**: Interactive, runnable, practical
4. **Video/Screencast**: Visual, engaging, accessible
5. **Workshop/Webinar**: Interactive, Q&A, community building
6. **GitHub Repository**: Code samples, templates, examples

### Recommended Format by Angle
| Angle | Primary Format | Secondary Format |
|-------|----------------|------------------|
| 1. Conceptual Guide | Documentation | Blog post |
| 2. Engineering Guide | Documentation | GitHub repo |
| 3. Evaluation Framework | Documentation + Notebook | Blog post |
| 4. Team Workflow | Documentation | Blog post |
| 5. Tutorial | Notebook | Video |
| 6. Comparison Guide | Documentation | Blog post |
| 7. Maturity Model | Documentation | Interactive tool |
| 8. Case Studies | Blog series | Video interviews |

---

## Conclusion

This document presents 8 distinct content angles for addressing skills, MCP, and evaluation. The recommended approach is a phased rollout starting with foundational conceptual content (Angles 1 & 6), followed by practical evaluation guidance (Angle 3) and hands-on tutorials (Angle 5).

**Immediate recommendation**: Start with **Angle 3 (Evaluation Framework)** as it directly addresses the Linear issue and builds on existing strong evaluation content, while creating **Angle 1 (Conceptual Guide)** in parallel to establish shared vocabulary.

This combination provides both immediate value to teams like Intuit and establishes Langfuse as a thought leader in the agent skills space.
