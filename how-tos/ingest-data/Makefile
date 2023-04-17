help:
	@echo "Usage examples:"
	@echo ""
	@echo "    make build"
	@echo "    make help"

.PHONY: build
build: build-parse_csv_data build-parse_json_data build-parse_json_lines_data build-set_value_from_local_file build-set_value_programmatically build-stream_data_from_api build-stream_data_from_ftp build-stream_the_current_datetime build-write_data_using_the_cli build-read_data_using_the_cli

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

.PHONY: build-stream_the_current_datetime
build-stream_the_current_datetime: 
	cd stream_the_current_datetime && make build

.PHONY: build-write_data_using_the_cli
build-write_data_using_the_cli: 
	cd write_data_using_the_cli && make build

.PHONY: build-read_data_using_the_cli
build-read_data_using_the_cli: 
	cd read_data_using_the_cli && make build
