# Bereshit

Bereshit is a knowledge-based software development tool for enterprise web applications.
It is inspired by model-driven development tools (like GeneXus) but designed to be open source and community-driven.

🚧 Status: The project is in development. The architecture, objects, and generators are evolving step by step.

## Vision

The goal of Bereshit is to allow developers to describe applications at a high level of abstraction (knowledge-based objects), and automatically generate the underlying database, backend services, and frontend applications.

This way, you focus on business knowledge, while Bereshit takes care of the implementation details.

## Roadmap & Stages of Construction

1.  **Core Engine**
    
 - [ ] Project creation
 - [ ] Define meta-model for knowledge objects (transactions, entities, actions).
 - [ ] Persistence layer to describe and version models.

        
2.  **Database Generator**
    
 - [ ] From `Transaction` objects → generate relational schemas.
 - [ ] Support for PostgreSQL.

        
3.  **Backend Generator**
    
  -   Not defined
        
4.  **Frontend Generator**
    
  -   Not defined
        
5.  **Deployment & Runtime**
    
  -   Not defined
