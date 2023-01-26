help:
	@echo "Usage examples:"
	@echo ""
	@echo "    make build"
	@echo "    make help"

.PHONY: build
build: build-parse_csv_data build-parse_json_data build-parse_json_lines_data

.PHONY: build-parse_csv_data
build-parse_csv_data: 
	cd parse_csv_data && make build

.PHONY: build-parse_json_data
build-parse_json_data:
	cd parse_json_data && make build

.PHONY: build-parse_json_lines_data
build-parse_json_lines_data: 
	cd parse_json_lines_data && make build

.PHONY: build-set_value_from_local_file
build-set_value_from_local_file: 
	cd set_value_from_local_file && make build

.PHONY: build-set_value_programmatically
build-set_value_programmatically: 
	cd set_value_programmatically && make build

.PHONY: build-stream_data_from_api
build-stream_data_from_api: 
	cd stream_data_from_api && make build

.PHONY: build-stream_data_from_ftp
build-stream_data_from_ftp: 
	cd stream_data_from_ftp && make build
