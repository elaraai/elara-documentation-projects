.PHONY: clean
clean:
	find . -name 'node_modules' -type d -prune -exec rm -rf '{}' +
	find . -name 'template.json' -prune -exec rm -rf '{}' +
	find . -name 'package-lock.json' -prune -exec rm -rf '{}' +

.PHONY: deploy
deploy:
	 cd 03_work_with_data/01_get_data_in_and_out/03_define_a_datasource && edk template deploy -ycw "03_01_03_define_a_datasource"
	 cd 03_work_with_data/01_get_data_in_and_out/09_define_a_value_datasource && edk template deploy -ycw "03_01_09_define_a_value_datasource"
	 cd 03_work_with_data/02_transform_data/02_define_and_launch_a_pipeline && edk template deploy -ycw "03_02_02_define_and_launch_a_pipeline"
	 cd 03_work_with_data/02_transform_data/03_define_a_pipeline_operation && edk template deploy -ycw "03_02_03_define_a_pipeline_operation"
	 cd 03_work_with_data/02_transform_data/05_define_an_expression && edk template deploy -ycw "03_02_05_define_an_expression"
	 cd 03_work_with_data/02_transform_data/06_input_streams_into_a_pipeline && edk template deploy -ycw "03_02_06_input_streams_into_a_pipeline"
	 cd 03_work_with_data/02_transform_data/07_handle_missing_values && edk template deploy -ycw "03_02_07_handle_missing_values"
	 cd 03_work_with_data/02_transform_data/09_define_and_launch_a_function && edk template deploy -ycw "03_02_09_define_and_launch_a_function"
	 cd 03_work_with_data/03_monitor_solutions/02_monitor_tasks && edk template deploy -ycw "03_03_02_monitor_tasks"
	 cd 03_work_with_data/04_validate_data/02_define_errors_and_warnings && edk template deploy -ycw "03_04_02_define_errors_and_warnings"
	 cd 03_work_with_data/05_use_complex_data_types/02_use_a_collection_type && edk template deploy -ycw "03_05_02_use_a_collection_type"
	 cd 03_work_with_data/05_use_complex_data_types/03_use_a_compound_type && edk template deploy -ycw "03_05_03_use_a_compound_type"
	 cd 03_work_with_data/06_transform_collection_data/02_validate_a_collection && edk template deploy -ycw "03_06_02_validate_a_collection"
	 cd 03_work_with_data/06_transform_collection_data/03_filter_a_collection && edk template deploy -ycw "03_06_03_filter_a_collection"
	 cd 03_work_with_data/06_transform_collection_data/04_aggregate_a_collection && edk template deploy -ycw "03_06_04_aggregate_a_collection"
	 cd 03_work_with_data/06_transform_collection_data/05_select_a_collection && edk template deploy -ycw "03_06_05_select_a_collection"
	 cd 03_work_with_data/06_transform_collection_data/06_disaggregate_a_collection_field && edk template deploy -ycw "03_06_06_disaggregate_a_collection_field"
	 cd 03_work_with_data/06_transform_collection_data/07_join_collections && edk template deploy -ycw "03_06_07_join_collections"
	 cd 03_work_with_data/06_transform_collection_data/08_concatenate_collections && edk template deploy -ycw "03_06_08_concatenate_collections"
	 cd 03_work_with_data/06_transform_collection_data/09_offset_a_collection_datastream && edk template deploy -ycw "03_06_09_offset_a_collection_datastream"
	 cd 03_work_with_data/07_visualise_data/02_define_a_table_visual && edk workspace deploy -ycw "03_07_02_define_a_table_visual"
	 cd 03_work_with_data/07_visualise_data/03_define_a_vega_visual && edk workspace deploy -ycw "03_07_03_define_a_vega_visual"
	 cd 03_work_with_data/07_visualise_data/04_define_a_tabbed_visual && edk workspace deploy -ycw "03_07_04_define_a_tabbed_visual"
	 cd 03_work_with_data/07_visualise_data/05_define_a_panelled_visual && edk workspace deploy -ycw "03_07_05_define_a_panelled_visual"
	 cd 03_work_with_data/07_visualise_data/06_define_a_split_visual && edk workspace deploy -ycw "03_07_06_define_a_split_visual"
	 cd 03_work_with_data/07_visualise_data/07_define_a_stacked_visual && edk workspace deploy -ycw "03_07_07_define_a_stacked_visual"
	 cd 03_work_with_data/07_visualise_data/08_define_a_view_visual && edk workspace deploy -ycw "03_07_08_define_a_view_visual"
	 cd 03_work_with_data/07_visualise_data/09_define_a_map_visual && edk workspace deploy -ycw "03_07_09_define_a_map_visual"
	 cd 03_work_with_data/07_visualise_data/10_define_a_timeline_visual && edk workspace deploy -ycw "03_07_10_define_a_timeline_visual"
	 cd 03_work_with_data/07_visualise_data/11_define_a_card_visual && edk workspace deploy -ycw "03_07_11_define_a_card_visual"
	 

.PHONY: install
install:
	 cd 03_work_with_data/01_get_data_in_and_out/03_define_a_datasource && npm i
	 cd 03_work_with_data/01_get_data_in_and_out/09_define_a_value_datasource && npm i
	 cd 03_work_with_data/02_transform_data/02_define_and_launch_a_pipeline && npm i
	 cd 03_work_with_data/02_transform_data/03_define_a_pipeline_operation && npm i
	 cd 03_work_with_data/02_transform_data/05_define_an_expression && npm i
	 cd 03_work_with_data/02_transform_data/06_input_streams_into_a_pipeline && npm i
	 cd 03_work_with_data/02_transform_data/07_handle_missing_values && npm i
	 cd 03_work_with_data/02_transform_data/09_define_and_launch_a_function && npm i
	 cd 03_work_with_data/03_monitor_solutions/02_monitor_tasks && npm i
	 cd 03_work_with_data/04_validate_data/02_define_errors_and_warnings && npm i
	 cd 03_work_with_data/05_use_complex_data_types/02_use_a_collection_type && npm i
	 cd 03_work_with_data/05_use_complex_data_types/03_use_a_compound_type && npm i
	 cd 03_work_with_data/06_transform_collection_data/02_validate_a_collection && npm i
	 cd 03_work_with_data/06_transform_collection_data/03_filter_a_collection && npm i
	 cd 03_work_with_data/06_transform_collection_data/04_aggregate_a_collection && npm i
	 cd 03_work_with_data/06_transform_collection_data/05_select_a_collection && npm i
	 cd 03_work_with_data/06_transform_collection_data/06_disaggregate_a_collection_field && npm i
	 cd 03_work_with_data/06_transform_collection_data/07_join_collections && npm i
	 cd 03_work_with_data/06_transform_collection_data/08_concatenate_collections && npm i
	 cd 03_work_with_data/06_transform_collection_data/09_offset_a_collection_datastream && npm i
	 cd 03_work_with_data/07_visualise_data/02_define_a_table_visual && npm i
	 cd 03_work_with_data/07_visualise_data/03_define_a_vega_visual && npm i
	 cd 03_work_with_data/07_visualise_data/04_define_a_tabbed_visual && npm i
	 cd 03_work_with_data/07_visualise_data/05_define_a_panelled_visual && npm i
	 cd 03_work_with_data/07_visualise_data/06_define_a_split_visual && npm i
	 cd 03_work_with_data/07_visualise_data/07_define_a_stacked_visual && npm i
	 cd 03_work_with_data/07_visualise_data/08_define_a_view_visual && npm i
	 cd 03_work_with_data/07_visualise_data/09_define_a_map_visual && npm i
	 cd 03_work_with_data/07_visualise_data/10_define_a_timeline_visual && npm i
	 cd 03_work_with_data/07_visualise_data/11_define_a_card_visual && npm i


.PHONY: build
build:
	 cd 03_work_with_data/01_get_data_in_and_out/03_define_a_datasource && edk template build
	 cd 03_work_with_data/01_get_data_in_and_out/09_define_a_value_datasource && edk template build
	 cd 03_work_with_data/02_transform_data/02_define_and_launch_a_pipeline && edk template build
	 cd 03_work_with_data/02_transform_data/03_define_a_pipeline_operation && edk template build
	 cd 03_work_with_data/02_transform_data/05_define_an_expression && edk template build
	 cd 03_work_with_data/02_transform_data/06_input_streams_into_a_pipeline && edk template build
	 cd 03_work_with_data/02_transform_data/07_handle_missing_values && edk template build
	 cd 03_work_with_data/02_transform_data/09_define_and_launch_a_function && edk template build
	 cd 03_work_with_data/03_monitor_solutions/02_monitor_tasks && edk template build
	 cd 03_work_with_data/04_validate_data/02_define_errors_and_warnings && edk template build
	 cd 03_work_with_data/05_use_complex_data_types/02_use_a_collection_type && edk template build
	 cd 03_work_with_data/05_use_complex_data_types/03_use_a_compound_type && edk template build
	 cd 03_work_with_data/06_transform_collection_data/02_validate_a_collection && edk template build
	 cd 03_work_with_data/06_transform_collection_data/03_filter_a_collection && edk template build
	 cd 03_work_with_data/06_transform_collection_data/04_aggregate_a_collection && edk template build
	 cd 03_work_with_data/06_transform_collection_data/05_select_a_collection && edk template build
	 cd 03_work_with_data/06_transform_collection_data/06_disaggregate_a_collection_field && edk template build
	 cd 03_work_with_data/06_transform_collection_data/07_join_collections && edk template build
	 cd 03_work_with_data/06_transform_collection_data/08_concatenate_collections && edk template build
	 cd 03_work_with_data/06_transform_collection_data/09_offset_a_collection_datastream && edk template build
	 cd 03_work_with_data/07_visualise_data/02_define_a_table_visual && edk template build
	 cd 03_work_with_data/07_visualise_data/03_define_a_vega_visual && edk template build
	 cd 03_work_with_data/07_visualise_data/04_define_a_tabbed_visual && edk template build
	 cd 03_work_with_data/07_visualise_data/05_define_a_panelled_visual && edk template build
	 cd 03_work_with_data/07_visualise_data/06_define_a_split_visual && edk template build
	 cd 03_work_with_data/07_visualise_data/07_define_a_stacked_visual && edk template build
	 cd 03_work_with_data/07_visualise_data/08_define_a_view_visual && edk template build
	 cd 03_work_with_data/07_visualise_data/09_define_a_map_visual && edk template build
	 cd 03_work_with_data/07_visualise_data/10_define_a_timeline_visual && edk template build
	 cd 03_work_with_data/07_visualise_data/11_define_a_card_visual && edk template build



.PHONY: delete
delete:
	cd 03_work_with_data/01_get_data_in_and_out/03_define_a_datasource && edk workspace delete "03_01_03_define_a_datasource"
	cd 03_work_with_data/01_get_data_in_and_out/09_define_a_value_datasource && edk workspace delete "03_01_09_define_a_value_datasource"
	cd 03_work_with_data/02_transform_data/02_define_and_launch_a_pipeline && edk workspace delete "03_02_02_define_and_launch_a_pipeline"
	cd 03_work_with_data/02_transform_data/03_define_a_pipeline_operation && edk workspace delete "03_02_03_define_a_pipeline_operation"
	cd 03_work_with_data/02_transform_data/05_define_an_expression && edk workspace delete "03_02_05_define_an_expression"
	cd 03_work_with_data/02_transform_data/06_input_streams_into_a_pipeline && edk workspace delete "03_02_06_input_streams_into_a_pipeline"
	cd 03_work_with_data/02_transform_data/07_handle_missing_values && edk workspace delete "03_02_07_handle_missing_values"
	cd 03_work_with_data/02_transform_data/09_define_and_launch_a_function && edk workspace delete "03_02_09_define_and_launch_a_function"
	cd 03_work_with_data/03_monitor_solutions/02_monitor_tasks && edk workspace delete "03_03_02_monitor_tasks"
	cd 03_work_with_data/04_validate_data/02_define_errors_and_warnings && edk workspace delete "03_04_02_define_errors_and_warnings"
	cd 03_work_with_data/05_use_complex_data_types/02_use_a_collection_type && edk workspace delete "03_05_02_use_a_collection_type"
	cd 03_work_with_data/05_use_complex_data_types/03_use_a_compound_type && edk workspace delete "03_05_03_use_a_compound_type"
	cd 03_work_with_data/06_transform_collection_data/02_validate_a_collection && edk workspace delete "03_06_02_validate_a_collection"
	cd 03_work_with_data/06_transform_collection_data/03_filter_a_collection && edk workspace delete "03_06_03_filter_a_collection"
	cd 03_work_with_data/06_transform_collection_data/04_aggregate_a_collection && edk workspace delete "03_06_04_aggregate_a_collection"
	cd 03_work_with_data/06_transform_collection_data/05_select_a_collection && edk workspace delete "03_06_05_select_a_collection"
	cd 03_work_with_data/06_transform_collection_data/06_disaggregate_a_collection_field && edk workspace delete "03_06_06_disaggregate_a_collection_field"
	cd 03_work_with_data/06_transform_collection_data/07_join_collections && edk workspace delete "03_06_07_join_collections"
	cd 03_work_with_data/06_transform_collection_data/08_concatenate_collections && edk workspace delete "03_06_08_concatenate_collections"
	cd 03_work_with_data/06_transform_collection_data/09_offset_a_collection_datastream && edk workspace delete "03_06_09_offset_a_collection_datastream"
	cd 03_work_with_data/07_visualise_data/02_define_a_table_visual && edk workspace delete "03_07_02_define_a_table_visual"
	cd 03_work_with_data/07_visualise_data/03_define_a_vega_visual && edk workspace delete "03_07_03_define_a_vega_visual"
	cd 03_work_with_data/07_visualise_data/04_define_a_tabbed_visual && edk workspace delete "03_07_04_define_a_tabbed_visual"
	cd 03_work_with_data/07_visualise_data/05_define_a_panelled_visual && edk workspace delete "03_07_05_define_a_panelled_visual"
	cd 03_work_with_data/07_visualise_data/06_define_a_split_visual && edk workspace delete "03_07_06_define_a_split_visual"
	cd 03_work_with_data/07_visualise_data/07_define_a_stacked_visual && edk workspace delete "03_07_07_define_a_stacked_visual"
	cd 03_work_with_data/07_visualise_data/08_define_a_view_visual && edk workspace delete "03_07_08_define_a_view_visual"
	cd 03_work_with_data/07_visualise_data/09_define_a_map_visual && edk workspace delete "03_07_09_define_a_map_visual"
	cd 03_work_with_data/07_visualise_data/10_define_a_timeline_visual && edk workspace delete "03_07_10_define_a_timeline_visual"
	cd 03_work_with_data/07_visualise_data/11_define_a_card_visual && edk workspace delete "03_07_11_define_a_card_visual"
