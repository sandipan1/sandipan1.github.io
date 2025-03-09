---
title: Stop Tweaking Prompts—Fix Your Retrieval and Win
date: 2025-03-06
description: A Comprehensive RAG Evaluation
categories:
  - Machine Learning
  - AI Engineering
  - LLM
  - RAG 
authors:
  - sandipan
---



## The Hidden Business Metrics Driving AI Success (or Costly Failure)

Are your AI generation systems consistently underperforming despite endless prompt tweaking? You're likely optimizing the wrong part of your pipeline. After analyzing  generation systems across industries, I've discovered an uncomfortable truth: most teams waste resources fine-tuning models and prompts while ignoring the foundation everything depends on—**retrieval quality**.

## The Costly Mistake Most AI Teams Make

Your generation task is only as good as the information it works with. Yet most teams spend weeks optimizing LLM prompts while dedicating minimal effort to their retrieval systems. This fundamental mistake costs companies thousands in wasted compute and engineering hours.

### Common Tradeoffs Between Content Generation & Retrieval

- **Speed**: Content generation takes 1-10 seconds per test, while retrieval takes only 10-800ms.
- **Cost**: Content generation can cost hundreds per run, whereas retrieval is negligible.
- **Objectivity**: Content evaluation is subjective, while retrieval metrics are quantitative.
- **Iteration Speed**: Content tuning takes hours, retrieval tuning takes minutes.
- **Scalability**: Content evaluation is limited, retrieval can be automated.

By focusing on retrieval first, you build a solid foundation that enhances everything else. Here’s why it matters and how to implement it systematically.

## Framing Generation as a Retrieval Problem

Consider text-to-SQL generation. Before generating SQL, the system must first retrieve relevant context efficiently:

The fundamental step is to create a dataset where each entry consists of an generated input (e.g., a prompt, a question) paired with its desired output (e.g., an answer, a summary, sql snippet). Now task of the retrieval system is to retrieve the SQL snippet from a query efficiently and accurately. By defining and tracking retrieval metrics like recall , MRR you can identify areas where the retrieval system is failing to find the correct SQL snippets for cetain type of queries which informs optimization effort like finetuning embedding model, experiment with different indexing

```python
```

### Key Benefits of Retrieval-First Approach

1. **Early edge case detection**: Identify potential failure points by analyzing retrieval errors before they impact production performance.
2. **Business logic integration**: Ensure that company-specific calculations, such as custom pricing rules or compliance constraints, are accurately retrieved and incorporated into query generation. For example, when handling tax computations, retrieving company-specific tax codes before generating SQL ensures compliance and accuracy:

```python

# Example tax code for a specific company
def calculate_tax(amount, tax_code):
    tax_rates = {"A": 0.05, "B": 0.1, "C": 0.15}  # Different tax rules per company
    return amount * tax_rates.get(tax_code, 0.08)  # Default tax rate if code is unknown

# Applying tax calculation in query generation
final_query = f"SELECT total_price, total_price + {calculate_tax('total_price', tax_code)} AS total_with_tax FROM orders"
```





```python
```

3. **Metrics-driven optimization**: Precision, recall, and MRR provide objective benchmarks and help ensure accurate and comprehensive infromation retrieval 
4. **Few-shot enhancement**: A generation task can be greatly improved by including few-shot examples especially those of business specific edge cases or difficult to retrieve.

## The Three-Step System for Optimizing Retrieval

### Step 1: Create Synthetic Test Data

Generate diverse test questions reflecting real user queries:

Example input:

```
challenging_examples = ["SELECT * FROM sales WHERE amount > 1000", "SELECT COUNT(*) FROM users WHERE signup_date > '2024-01-01'"]
```

Example output:

```
[{
    "question": "How many users signed up after January 1, 2024?",
    "relevance": "high"
}, {
    "question": "Show all sales transactions where the amount exceeds 1000.",
    "relevance": "high"
}]
```

```python
from pydantic import BaseModel
from instructor import OpenAI
import random

class SyntheticQuestion(BaseModel):
    question: str
    relevance: str

client = OpenAI()
questions = []

for sql_example in challenging_examples:
    constraints = random.choice(["time", "amount", "limit", "comparison"])
    question = client.structured_generate(
        SyntheticQuestion,
        prompt=f"Generate a question for this SQL: {sql_example}. Add {constraints} constraint."
    )
    questions.append(question)
```

This ensures comprehensive test coverage without needing real user data.

### Step 2: Define Meaningful Retrieval Metrics

- **Precision\@K**: How many retrieved items are relevant?
  - *improving precision makes sure we are not wasting resources and increasing latency by processing information which are irrelevant*
- **Recall\@K**: How many relevant items did we retrieve? 
  - &#x20;*By optimizing for recall, we ensure that the language model has access to all necessary information, which can lead to more accurate and reliable generated responses.*
- **MRR (Mean Reciprocal Rank)**: How highly ranked are the relevant items?
  - *if we want to display retrieved results as citations to users, we only show the highly ranked retrieved results to the user.* 

For most generation tasks, **recall** is critical—your LLM needs all necessary information to generate accurate responses.

### Step 3: Build Your Evaluation Pipeline

For example, you want to improve performance and accuracy of your text-to-SQL system for your analytics engine.

You want to evaluate if adding a reranker is worth it.  While it promised better results, 200ms latency and \$0.01 per query.

You need a way to systematically improve your system with data driven methods so that you are not wasting months on the wrong thing. 



Set up an automated pipeline to test different retrieval strategies:

```python
# Compare different retrieval approaches systematically
for embedding_model in ["text-embedding-3-small", "text-embedding-3-large"]:
    for search_type in ["vector", "hybrid"]:
        for use_reranker in [True, False]:
            results = evaluate_retrieval(
                questions,
                embedding_model=embedding_model,
                search_type=search_type,
                use_reranker=use_reranker
            )
            log_metrics(results)
```

Finding from the evaluation pipeline : 

1. Upgrading from text-embedding-3-small to text-embedding-3-large provided better performance than adding a re-ranker.
2. The larger embedding model achieved near-perfect recall (0.98) at k=20 without a re-ranker.
3. The re-ranker showed minimal statistical improvement, confirmed using bootstrapping and t-tests.We avoided an unnecessary cost while improving overall performance.&#x20;

This allows for **evidence-based decisions** about retrieval architecture.

## Validating Your Improvements with Statistical Rigor

Once you see performance improvements, validate them statistically:

- **Bootstrap sampling**: Simulate multiple runs to estimate result stability.
- **Confidence intervals**: Visualize performance ranges to identify overlapping results.
- **Statistical testing**: Use t-tests to confirm if differences are significant.

When comparing embedding models, **t-statistics below -10 and p-values < 0.001** confirmed that the larger model's superior performance was statistically significant.

## Three Critical Mistakes to Avoid

1. **Starting with generation evaluation**: This is slow, expensive, and subjective. Start with retrieval metrics for faster iteration.
2. **Using narrow test data**: Generate diverse synthetic questions to uncover blind spots.
3. **Making decisions without statistical validation**: Ensure improvements are real, not just random variation.

## Start Measuring What Matters

Retrieval isn’t just a nice-to-have—it’s the backbone of effective generation tasks. Whether you’re summarizing, reporting, or extracting insights, it’s the step that turns potential into performance

The most profitable AI systems aren’t built on hype—they’re built on systematic measurement and optimization that drive real business impact. By prioritizing retrieval, you will create AI generation systems that are **faster, more reliable, and cost-effective**.

Don't let poor retrieval undermine your AI projects. **Start optimizing today.**

---
