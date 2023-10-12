help:
	@echo "Usage examples:"
	@echo ""
	@echo "    make build"
	@echo "    make help"

.PHONY: build
build: build-ingest-data build-visualize-data

.PHONY: build-ingest-data
build-ingest-data: 
	cd ingest-data && make build
	
.PHONY: build-visualize-data
build-visualize-data: 
	cd visualize-data && make build