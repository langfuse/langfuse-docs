## **About Sumup**

SumUp is a leading global fintech company trusted by over 4 million merchants in more than 30+ markets worldwide. It stands out by making card payments easy and accessible for small businesses, offering simple, reliable hardware and software solutions. 

## **The challenge: Rolling out AI powered first level support across 4 million merchants in 30+ Markets**

The mission was simple: empower Sumup’s merchant support teams with an AI assistant as the first entry point for all customer support touchpoints.

Yet the challenge was far from trivial: 

**Multi market complexity and scale:** Sumups merchant support serves over 4 million merchants across 30+ markets with market specific differences in requirements. 

**Security & Privacy:** SumUp operates in Financial Services, data privacy and security are of paramount importance and had to be maintained throughout the project. **Systems** 

**Integration:** Conversations within SumUp’s customers are usually complex and require followups and clarifications as well as querying a variety of systems. The implementation had to model highly complex LLM interactions and tool uses.

## **Sumup’s solution: multiple layers of AI empowerment**

**Merchant facing:** AI assistant that answers first line of questions & routes the conversation to humans if nessecary 

**Inward facing tools:** Self-built AI translation tools allow support agents to help merchants in other languages than their own & an AI assistant that help agents finds most relevant resources and answers faster

## **The strategy & tactics behind SumUp’s rollout to 30+ markets within 10 months**

SumUp handled their market rollout strategically and incrementally:

1. Expansion Strategy  
   1. Begin with English-speaking markets  
   2. Focus on smaller volume merchants first  
   3. Slowly increase volume while monitoring reliability metrics  
   4. Expanded based on performance benchmarks  
   5. Prioritized markets with no existing support as "better than nothing"

2. Rollout Timeline:  
   1. Initial Launch: Started in January 2024 with Ireland and UK, choosing Ireland first as a smaller market for initial testing.  
   2. June-August 2024: First market expansion  
   3. September 2024: Full deployment across markets

3. Checks before each expansion  
   1. Compared performance against previous chatbot  
   2. Required same or better results before expanding

## **How SumUp is using Langfuse**

In early PoC stages of the project SumUp got started quickly with using Langfuse Self-Hosting – no long vendor onboarding & evaluation before having a better understanding of project requirements and needs. 

Once the system got closer to production and full rollout the team happily switched over to let Langfuse Cloud do the grunt work of making the systems run reliably. 

Tracing was the clear starting point of implementation.

*“Projects like ours often start from an Engineering perspective. Langfuse gave us full observability and asynchronous debugging powers out of the box. If anyone builds an LLM application they should start with that.” – Luis Dreisbach*

During the project the team has set up elaborate multi-team workflows to power continuous development & monitoring of 25 users across Engineering, Support Operations, Content, Q\&A and other stakeholders.

Their workflows are powered by different Langfuse modules:

**Tracing**  
A unified view on all LLM inputs, tool uses and outputs across functions. Engineers can run very detailed asynchronous debugging. Content owners understand shortcomings of LLM inputs & context documents. Q\&A has full visibility in output quality

**Prompt Management**   
Content teams and engineers alike can iterate and test prompt changes in production really fast. The system is integrated with a self-built set of evaluators to test new iterations automatically.

**Langfuse Playground**   
It lets SumUp reproduce exact production configs, variables and tool integrations from production traces into a simple UI to quickly iterate on prompt improvements before implementing them. Reproducing the exact production environment was very time consuming for engineers and impossible for non-technical staff before using Langfuse.

## **Business impact**

“Building on Langfuse we have achieved 50% of savings on conversations that don't go to humans. It's like 300,000 monthly merchant requests that no longer require human support – that’s 20,000 per day\! Even though merchant numbers go up fast; we can focus our resources to the really tricky problems " – Ana Casado, Head of Operations Data and AI

| PoC to 30+ markets success | What started with one market and low volume merchants was successfully rolled out to 4 million merchants in 30+ markets and across merchant tiers within 10 months. |
| :---- | :---- |
| Scalability & Quality | Scaling AI powered first level merchant support from 1,000 to 600,000 monthly conversations leading not to worse but actually better merchant experiences. Even though the number of merchants is growing strong, human in the loop support significantly is reduced. |
| 50% BPO Cost Reduction  | The implementation has achieved a deflection rate of 50% which directly translates into a 50% cost reduction of external BPO (Business Process Outsourcing) cost.  |
| Multi-Team Collaboration | 25 users across engineering, content owners and QA have implemented robust workflows for continuous process improvements on Langfuse |