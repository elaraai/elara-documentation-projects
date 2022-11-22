help:
	@echo "Usage examples:"
	@echo ""
	@echo "    make build"
	@echo "    make help"

.PHONY: build
build: build-02_get_data_in_and_out build-03_transform_data build-05_validate_data build-06_use_collection_data_types build-08_ingest_file_data build-06_transform_collection_data build-08_manage_templates

.PHONY: build-02_get_data_in_and_out
build-02_get_data_in_and_out: 
	cd 02_get_data_in_and_out && make build

.PHONY: build-03_transform_data
build-03_transform_data: 
	cd 03_transform_data && make build

.PHONY: build-05_validate_data
build-05_validate_data:
	cd 05_validate_data && make build

.PHONY: build-06_use_collection_data_types
build-06_use_collection_data_types: 
	cd 06_use_collection_data_types && make build

.PHONY: build-08_ingest_file_data
build-08_ingest_file_data: 
	cd 08_ingest_file_data && make build

.PHONY: build-06_transform_collection_data
build-06_transform_collection_data: 
	cd 06_transform_collection_data && make build

.PHONY: build-08_manage_templates
build-08_manage_templates: 
	cd 08_manage_templates && make build