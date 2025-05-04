---
title: Data Systems Hall of Fame
# date: 2025-05-03T21:20:16.681Z
description: Brief intros to popular data systems
draft: false
---
# Background
Data systems are software that specializes in the storage, retrieval, and processing of data. Just
as operating systems provide an abstraction layer for user-level programs to utilize hardware
resources, data systems provide an abstraction to leverage OS resources specifically for data
storage, retrieval, and processing. They aim to solve difficult problems that are common when
implementing data-intensive systems, preventing software developers from having to "reinvent the
wheel" for each specific business application — imagine a world where every application stores
data in raw CSV files and implements complicated logic to retrieve and process them!

This is 2025. It has been 18 years since Steve Jobs unveiled the first-generation iPhone in 2007,
13 years since AlexNet won the ImageNet competition in 2012, 3 years since OpenAI launched ChatGPT
in 2022. The first event marks the beginning of Mobile Revolution, while the latter two are
hallmarks of AI Revolution. The number of smartphone users grew from zero in 2007 to more than 4
billion in 2024, with projections suggesting the total will surpass 6 billion by 2029. During the
same time period, mobile network technology has evolved from 3G to 4G and now 5G, boosting average
cellular bandwidth from single-digit to triple-digit Mbps. Meanwhile, the AI Revolution has introduced a
brand new paradigm of software development. While traditional algorithms deterministically follow
pre-coded instructions to solve problems, machine learning algorithms employ probablistic models
that can "learn" from data. In this way, processing data is not only the goal of software
development, but also becomes part of the software development process itself.

Both data volume and data complexity have been exploding with these revolutions. Volume-wise, as
an example, Meta Platforms' daily active users have grown from approximately 600 million in 2012
to around 3.4 billion in 2024. Additionally, it's reasonable to assume that the average amount of
data each user generates has also increased significantly during this period. Complexity-wise, it
comes in forms of both data type variety and use case variety. When Larry Ellison co-founded Oracle
in 1977, the newly-born Oracle Databases's primary customer was CIA. Several decades passed,
nowadays you can see various kinds of purpose-built data systems running everywhere supports
various kinds of use cases: web page indexing for search engines, social network graph relationship
modeling, multi-modal data processing (including text, audio, and video), geospacial data for
location-based services, time-series stock transaction data, embedding vectors for genAI
applications, so on and so forth.


# To Be Introduced
- SQL/OLAP Engines/Databases
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
