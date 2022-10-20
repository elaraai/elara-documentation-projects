help:
	@echo "Usage examples:"
	@echo ""
	@echo "    make build"
	@echo "    make help"

.PHONY: build
build: build-02_filter_a_collection build-03_disaggregate_a_collection_field build-04_join_collections build-05_aggregate_a_collection build-06_offset_a_collection_datastream build-07_select_a_collection

.PHONY: build-02_filter_a_collection
build-02_filter_a_collection: 
	cd 02_filter_a_collection && make build

.PHONY: build-03_disaggregate_a_collection_field
build-03_disaggregate_a_collection_field: 
	cd 03_disaggregate_a_collection_field && make build

.PHONY: build-04_join_collections
build-04_join_collections: 
	cd 04_join_collections && make build

.PHONY: build-05_aggregate_a_collection
build-05_aggregate_a_collection: 
	cd 05_aggregate_a_collection && make build

.PHONY: build-06_offset_a_collection_datastream
build-06_offset_a_collection_datastream: 
	cd 06_offset_a_collection_datastream && make build
	
.PHONY: build-07_select_a_collection
build-07_select_a_collection: 
	cd 07_select_a_collection && make build