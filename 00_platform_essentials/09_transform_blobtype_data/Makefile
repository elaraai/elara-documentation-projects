help:
	@echo "Usage examples:"
	@echo ""
	@echo "    make build"
	@echo "    make help"

.PHONY: build
build: build-01_parse_tabular_data 02_parse_nested_data

.PHONY: build-01_parse_tabular_data
build-01_parse_tabular_data: 
	cd 01_parse_tabular_data && make build

.PHONY: build-02_parse_nested_data
build-02_parse_nested_data: 
	cd 02_parse_nested_data && make build
