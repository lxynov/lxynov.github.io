---
title: Data Systems Hall of Fame
# date: 2025-05-03T21:20:16.681Z
description: Brief intros to popular data systems
draft: false
---
# Background
Data systems are software that specializes in the storage, retrieval, and processing of data. Just
as operating systems provide an abstraction layer for user-level programs to utilize hardware
resources, data systems provide an abstraction to efficiently utilize OS resources specifically for
data storage, retrieval, and processing. They aim to solve difficult problems that are common when
implementing data-intensive systems, so that software developers don't have to "reinvent the
wheel" for every specific business application — imagine a world where every application stores
data in raw CSV files and implements complicated logic to retrieve and process them!

This is 2025. It has been 18 years since Steve Jobs unveiled the first-generation iPhone, 13 years
since AlexNet won the ImageNet competition, 3 years since OpenAI launched ChatGPT. The iPhone
launch marks the beginning of Mobile Revolution, while AlexNet and ChatGPT are both hallmarks of
AI Revolution. As part of Mobile Revolution, the number of smartphone users grew from zero in 2007
to more than 4 billion in 2024, with projections to surpass 6 billion by 2029. During the same time
period, mobile technology has evolved from 3G to 4G and now 5G, boosting cellular bandwidth from
single-digit to triple-digit Mbps. Meanwhile, the AI Revolution has introduced a brand new paradigm
of software development. While traditional algorithms deterministically follow pre-coded
instructions to solve problems, machine learning algorithms employ probablistic models that can
"learn" from data. In this way, data processing becomes not only the goal of software development,
but also part of the software development process itself.

Both data volume and data complexity have been exploding with these revolutions. Volume-wise, as
a concrete example, Meta Platforms' daily active users have grown from approximately 600 million in
2012 to around 3.4 billion in 2024. Obviously, the average amount of data each user generates has
also increased significantly during this period. Complexity-wise, it comes in forms of both data
type variety and use case variety. Mobile Revolution transformed when, where, and how users
interacted with computer systems. With a boom in the mobile app ecosystem, nowadays tech companies
need to process and analyze various categories of data: geospacial data for location-based services,
web pages for search engines, social network graphs, health metrics from wearable devices,
user-generated multi-modal data (text, audio, and video), time-series stock transaction data, so on
and so forth. With diverse features of mobile apps, data use cases vary a lot, too, each presenting
unique requirements and access patterns. AI, as mentioned earlier, is also creating brand new data
use cases.

The dynamic and fast-changing nature of data needs has been the reason why we see a rich ecosystem
of purpose-built data systems today. With the explosion in data volume and complexity, there is no
longer a one-size-fits-all solution for today's data needs. In the past two decades, especially
before AI dominated news headlines, we've been seeing a plethora of data systems buzzwords emerging
from time to time: NoSQL, NewSQL, Big Data, Lakehouse, Cloud-Native, Batch Procssing, Stream
Processing, VectorDB, etc. These data systems aim to solve the difficult problems in Internet
application development, and have been serving as the foundation for the tech industry's prosperity.

# Objectives

This post explores popular data systems. The primary objective is to motivate the author to learn
about different kinds of data systems and grasp the essence of each. With broader knowledge, it's
easier to find the right way to solve an engineering problem. Additionally, intellectual wandering
may spark innovation. By examining and dissecting various systems, we may gain hidden insights into
data system design and how data systems impact the world.

Unlike Naismith Basketball Hall of Fame, selection into this "Data Systems Hall of Fame" is totally
arbitrary and subjective. Most of the cases, a system would be added when 1. it's a high-impact
one; 2. the author didn't know much about it yet; 3. the author is interested and happen to have
some free time to learn about it.

This is a running post which may be updated irregularly. 

# To Be Introduced
- Analytical Engines/Databases
  - Trino
  - StarRocks
  - DuckDB
  - ClickHouse
  - Apache Druid
  - Apache Pinot
- Data Processing Frameworks
  - Apache Spark
  - Apache Flink
  - Apache Kafka
- Table/File Formats
  - Apache Iceberg
  - Apache Parquet
  - Lance
- Composable Libraries/Frameworks
  - Apache Arrow
  - Velox
  - Apache Calcite
- "NoSQL" Databases
  - Redis
  - MongoDB
  - Apache Cassandra
  - RocksDB
  - LevelDB
- Graph Databases
  - Neo4j
- Timeseries Databases
  - InfluxDB

# References
- https://prioridata.com/data/smartphone-stats
- https://ycharts.com/indicators/meta_platforms_inc_meta_dau
- https://mattturck.com/mad2024
