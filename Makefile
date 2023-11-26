.PHONY: clean
clean:
	find . -name 'node_modules' -type d -prune -exec rm -rf '{}' +
	find . -name 'template.json' -prune -exec rm -rf '{}' +
	find . -name 'package-lock.json' -prune -exec rm -rf '{}' +

.PHONY: deploy
deploy:
	 cd 01_manage_solutions/01_understand_solutions/01_what_is_elara && edk template deploy -ycw "01_01_01_what_is_elara"
	 cd 01_manage_solutions/01_understand_solutions/02_why_use_elara && edk template deploy -ycw "01_01_02_why_use_elara"
	 cd 01_manage_solutions/01_understand_solutions/03_how_is_elara_used && edk template deploy -ycw "01_01_03_how_is_elara_used"
	 cd 02_manage_the_platform/01_setup_your_dev_environment/01_install_edk_cli && edk template deploy -ycw "02_01_01_install_edk_cli"
	 cd 02_manage_the_platform/01_setup_your_dev_environment/02_log_in && edk template deploy -ycw "02_01_02_log_in"
	 cd 02_manage_the_platform/01_setup_your_dev_environment/03_initialise_a_project && edk template deploy -ycw "02_01_03_initialise_a_project"
	 cd 02_manage_the_platform/01_setup_your_dev_environment/04_learn_typescript_fundamentals && edk template deploy -ycw "02_01_04_learn_typescript_fundamentals"
	 cd 02_manage_the_platform/02_manage_access/01_manage_users && edk template deploy -ycw "02_02_01_manage_users"
	 cd 02_manage_the_platform/02_manage_access/02_manage_platform_roles && edk template deploy -ycw "02_02_02_manage_platform_roles"
	 cd 02_manage_the_platform/03_manage_tenants/01_create_and_delete_tenants && edk template deploy -ycw "02_03_01_create_and_delete_tenants"
	 cd 02_manage_the_platform/03_manage_tenants/02_manage_tenant_users && edk template deploy -ycw "02_03_02_manage_tenant_users"
	 cd 02_manage_the_platform/03_manage_tenants/03_manage_tenant_roles && edk template deploy -ycw "02_03_03_manage_tenant_roles"
	 cd 02_manage_the_platform/03_manage_tenants/04_manage_tenant_usage && edk template deploy -ycw "02_03_04_manage_tenant_usage"
	 cd 03_work_with_data/01_get_data_in_and_out/01_what_is_a_datastream && edk template deploy -ycw "03_01_01_what_is_a_datastream"
	 cd 03_work_with_data/01_get_data_in_and_out/02_what_is_a_datasource && edk template deploy -ycw "03_01_02_what_is_a_datasource"
	 cd 03_work_with_data/01_get_data_in_and_out/03_define_a_datasource && edk template deploy -ycw "03_01_03_define_a_datasource"
	 cd 03_work_with_data/01_get_data_in_and_out/04_launch_a_solution && edk template deploy -ycw "03_01_04_launch_a_solution"
	 cd 03_work_with_data/01_get_data_in_and_out/05_view_datastream_status && edk template deploy -ycw "03_01_05_view_datastream_status"
	 cd 03_work_with_data/01_get_data_in_and_out/06_write_data_to_a_datastream && edk template deploy -ycw "03_01_06_write_data_to_a_datastream"
	 cd 03_work_with_data/01_get_data_in_and_out/07_read_a_datastream_value && edk template deploy -ycw "03_01_07_read_a_datastream_value"
	 cd 03_work_with_data/01_get_data_in_and_out/08_delete_a_value_in_a_datastream && edk template deploy -ycw "03_01_08_delete_a_value_in_a_datastream"
	 cd 03_work_with_data/01_get_data_in_and_out/09_define_a_value_datasource && edk template deploy -ycw "03_01_09_define_a_value_datasource"
	 cd 03_work_with_data/02_transform_data/01_what_is_a_pipeline && edk template deploy -ycw "03_02_01_what_is_a_pipeline"
	 cd 03_work_with_data/02_transform_data/02_define_and_launch_a_pipeline && edk template deploy -ycw "03_02_02_define_and_launch_a_pipeline"
	 cd 03_work_with_data/02_transform_data/03_define_a_pipeline_operation && edk template deploy -ycw "03_02_03_define_a_pipeline_operation"
	 cd 03_work_with_data/02_transform_data/04_what_are_expressions && edk template deploy -ycw "03_02_04_what_are_expressions"
	 cd 03_work_with_data/02_transform_data/05_define_an_expression && edk template deploy -ycw "03_02_05_define_an_expression"
	 cd 03_work_with_data/02_transform_data/06_input_streams_into_a_pipeline && edk template deploy -ycw "03_02_06_input_streams_into_a_pipeline"
	 cd 03_work_with_data/02_transform_data/07_handle_missing_values && edk template deploy -ycw "03_02_07_handle_missing_values"
	 cd 03_work_with_data/02_transform_data/08_what_is_a_function && edk template deploy -ycw "03_02_08_what_is_a_function"
	 cd 03_work_with_data/02_transform_data/09_define_and_launch_a_function && edk template deploy -ycw "03_02_09_define_and_launch_a_function"
	 cd 03_work_with_data/03_monitor_solutions/01_what_is_a_task && edk template deploy -ycw "03_03_01_what_is_a_task"
	 cd 03_work_with_data/03_monitor_solutions/02_monitor_tasks && edk template deploy -ycw "03_03_02_monitor_tasks"
	 cd 03_work_with_data/04_validate_data/01_what_are_errors_and_warnings && edk template deploy -ycw "03_04_01_what_are_errors_and_warnings"
	 cd 03_work_with_data/04_validate_data/02_define_errors_and_warnings && edk template deploy -ycw "03_04_02_define_errors_and_warnings"
	 cd 03_work_with_data/05_use_complex_data_types/01_what_are_complex_types && edk template deploy -ycw "03_05_01_what_are_complex_types"
	 cd 03_work_with_data/05_use_complex_data_types/02_use_a_collection_type && edk template deploy -ycw "03_05_02_use_a_collection_type"
	 cd 03_work_with_data/05_use_complex_data_types/03_use_a_compound_type && edk template deploy -ycw "03_05_03_use_a_compound_type"
	 cd 03_work_with_data/06_transform_collection_data/01_what_are_collection_operations && edk template deploy -ycw "03_06_01_what_are_collection_operations"
	 cd 03_work_with_data/06_transform_collection_data/02_validate_a_collection && edk template deploy -ycw "03_06_02_validate_a_collection"
	 cd 03_work_with_data/06_transform_collection_data/03_filter_a_collection && edk template deploy -ycw "03_06_03_filter_a_collection"
	 cd 03_work_with_data/06_transform_collection_data/04_aggregate_a_collection && edk template deploy -ycw "03_06_04_aggregate_a_collection"
	 cd 03_work_with_data/06_transform_collection_data/05_select_a_collection && edk template deploy -ycw "03_06_05_select_a_collection"
	 cd 03_work_with_data/06_transform_collection_data/06_disaggregate_a_collection_field && edk template deploy -ycw "03_06_06_disaggregate_a_collection_field"
	 cd 03_work_with_data/06_transform_collection_data/07_join_collections && edk template deploy -ycw "03_06_07_join_collections"
	 cd 03_work_with_data/06_transform_collection_data/08_concatenate_collections && edk template deploy -ycw "03_06_08_concatenate_collections"
	 cd 03_work_with_data/06_transform_collection_data/09_offset_a_collection_datastream && edk template deploy -ycw "03_06_09_offset_a_collection_datastream"
	 cd 03_work_with_data/07_visualise_data/01_what_is_a_layout && edk template deploy -ycw "03_07_01_what_is_a_layout"
	 cd 03_work_with_data/07_visualise_data/02_define_a_table_visual && edk template deploy -ycw "03_07_02_define_a_table_visual"
	 cd 03_work_with_data/07_visualise_data/03_define_a_vega_visual && edk template deploy -ycw "03_07_03_define_a_vega_visual"
	 cd 03_work_with_data/07_visualise_data/04_define_a_tabbed_visual && edk template deploy -ycw "03_07_04_define_a_tabbed_visual"
	 cd 03_work_with_data/07_visualise_data/05_define_a_panelled_visual && edk template deploy -ycw "03_07_05_define_a_panelled_visual"
	 cd 04_work_with_models/03_build_a_model/01_define_a_descriptive_scenario && edk template deploy -ycw "04_03_01_define_a_descriptive_scenario"
	 cd 04_work_with_models/03_build_a_model/02_whats_an_ml_builder && edk template deploy -ycw "04_03_02_whats_an_ml_builder"
	 cd 04_work_with_models/03_build_a_model/03_define_a_predictive_scenario && edk template deploy -ycw "04_03_03_define_a_predictive_scenario"
	 cd 04_work_with_models/03_build_a_model/04_define_a_prescriptive_scenario && edk template deploy -ycw "04_03_04_define_a_prescriptive_scenario"
	 cd 04_work_with_models/03_build_a_model/05_define_an_interactive_scenario && edk template deploy -ycw "04_03_05_define_an_interactive_scenario"
	 cd 05_use_expressions/01_introduction_to_east/01_why_east && edk template deploy -ycw "05_01_01_why_east"
	 cd 05_use_expressions/01_introduction_to_east/02_east_values_and_types && edk template deploy -ycw "05_01_02_east_values_and_types"
	 cd 05_use_expressions/01_introduction_to_east/03_east_expressions && edk template deploy -ycw "05_01_03_east_expressions"
	 cd 05_use_expressions/02_primitive_data/01_boolean_logic && edk template deploy -ycw "05_02_01_boolean_logic"
	 cd 05_use_expressions/02_primitive_data/02_integers_and_floats && edk template deploy -ycw "05_02_02_integers_and_floats"
	 cd 05_use_expressions/02_primitive_data/03_strings && edk template deploy -ycw "05_02_03_strings"
	 cd 05_use_expressions/02_primitive_data/04_datetime && edk template deploy -ycw "05_02_04_datetime"
	 cd 05_use_expressions/02_primitive_data/05_null && edk template deploy -ycw "05_02_05_null"
	 cd 05_use_expressions/02_primitive_data/06_equality_and_ordering && edk template deploy -ycw "05_02_06_equality_and_ordering"
	 cd 05_use_expressions/03_compound_data/01_structs && edk template deploy -ycw "05_03_01_structs"
	 cd 05_use_expressions/03_compound_data/02_variants && edk template deploy -ycw "05_03_02_variants"
	 cd 05_use_expressions/03_compound_data/03_subtypes && edk template deploy -ycw "05_03_03_subtypes"
	 cd 05_use_expressions/04_data_collections/01_arrays && edk template deploy -ycw "05_04_01_arrays"
	 cd 05_use_expressions/04_data_collections/02_sets && edk template deploy -ycw "05_04_02_sets"
	 cd 05_use_expressions/04_data_collections/03_dictionaries && edk template deploy -ycw "05_04_03_dictionaries"
	 cd 05_use_expressions/04_data_collections/04_filtering && edk template deploy -ycw "05_04_04_filtering"
	 cd 05_use_expressions/04_data_collections/05_transforming && edk template deploy -ycw "05_04_05_transforming"
	 cd 05_use_expressions/04_data_collections/06_reduction && edk template deploy -ycw "05_04_06_reduction"
	 cd 05_use_expressions/04_data_collections/07_aggregation && edk template deploy -ycw "05_04_07_aggregation"
	 cd 05_use_expressions/05_blob_data/01_basics && edk template deploy -ycw "05_05_01_basics"
	 cd 05_use_expressions/05_blob_data/02_string_conversion && edk template deploy -ycw "05_05_02_string_conversion"
	 cd 05_use_expressions/05_blob_data/03_csv_conversion && edk template deploy -ycw "05_05_03_csv_conversion"
	 cd 05_use_expressions/06_advanced_topics/01_random && edk template deploy -ycw "05_06_01_random"
	 cd 05_use_expressions/06_advanced_topics/02_machine_learning && edk template deploy -ycw "05_06_02_machine_learning"
	 cd 05_use_expressions/06_advanced_topics/03_mutation && edk template deploy -ycw "05_06_03_mutation"
	 cd 06_work_with_complex_data/01_patch_data/01_what_is_a_patch_source && edk template deploy -ycw "06_01_01_what_is_a_patch_source"
	 cd 06_work_with_complex_data/01_patch_data/02_define_a_patch_source && edk template deploy -ycw "06_01_02_define_a_patch_source"
	 cd 06_work_with_complex_data/03_use_blobtype_data/01_what_is_the_blob_type && edk template deploy -ycw "06_03_01_what_is_the_blob_type"
	 cd 06_work_with_complex_data/03_use_blobtype_data/02_define_a_blobtype && edk template deploy -ycw "06_03_02_define_a_blobtype"
	 cd 06_work_with_complex_data/03_use_blobtype_data/03_validate_a_blobtype && edk template deploy -ycw "06_03_03_validate_a_blobtype"
	 cd 06_work_with_complex_data/03_use_blobtype_data/04_what_are_blobtype_operations && edk template deploy -ycw "06_03_04_what_are_blobtype_operations"
	 cd 06_work_with_complex_data/03_use_blobtype_data/05_define_a_file_datasource && edk template deploy -ycw "06_03_05_define_a_file_datasource"
	 cd 06_work_with_complex_data/03_use_blobtype_data/06_parse_from_blob_data && edk template deploy -ycw "06_03_06_parse_from_blob_data"
	 cd 06_work_with_complex_data/03_use_blobtype_data/07_unparse_to_blob_data && edk template deploy -ycw "06_03_07_unparse_to_blob_data"
	 cd 06_work_with_complex_data/04_use_varianttype_data/01_what_is_the_variant_data_type && edk template deploy -ycw "06_04_01_what_is_the_variant_data_type"
	 cd 06_work_with_complex_data/04_use_varianttype_data/02_define_a_varianttype && edk template deploy -ycw "06_04_02_define_a_varianttype"
	 cd 06_work_with_complex_data/04_use_varianttype_data/03_use_varianttype_data && edk template deploy -ycw "06_04_03_use_varianttype_data"
	 cd 07_ingest_and_transform_data/01_ingest_data/01_set_value_from_local_file && edk template deploy -ycw "07_01_01_set_value_from_local_file"
	 cd 07_ingest_and_transform_data/01_ingest_data/02_set_value_programmatically && edk template deploy -ycw "07_01_02_set_value_programmatically"
	 cd 07_ingest_and_transform_data/01_ingest_data/03_read_data_using_the_cli && edk template deploy -ycw "07_01_03_read_data_using_the_cli"
	 cd 07_ingest_and_transform_data/01_ingest_data/04_write_data_using_the_cli && edk template deploy -ycw "07_01_04_write_data_using_the_cli"
	 cd 07_ingest_and_transform_data/01_ingest_data/05_stream_data_from_ftp && edk template deploy -ycw "07_01_05_stream_data_from_ftp"
	 cd 07_ingest_and_transform_data/01_ingest_data/06_stream_data_from_api && edk template deploy -ycw "07_01_06_stream_data_from_api"
	 cd 07_ingest_and_transform_data/01_ingest_data/07_stream_data_from_s3 && edk template deploy -ycw "07_01_07_stream_data_from_s3"
	 cd 07_ingest_and_transform_data/01_ingest_data/08_ingest_with_cron && edk template deploy -ycw "07_01_08_ingest_with_cron"
	 cd 07_ingest_and_transform_data/02_transform_data/01_use_a_random_expression && edk template deploy -ycw "07_02_01_use_a_random_expression"
	 cd 07_ingest_and_transform_data/02_transform_data/02_use_a_range_expression && edk template deploy -ycw "07_02_02_use_a_range_expression"
	 cd 07_ingest_and_transform_data/02_transform_data/03_use_a_reduce_expression && edk template deploy -ycw "07_02_03_use_a_reduce_expression"
	 cd 07_ingest_and_transform_data/08_send_data_out/01_what_is_a_datasink && edk template deploy -ycw "07_08_01_what_is_a_datasink"
	 cd 07_ingest_and_transform_data/08_send_data_out/02_define_a_datasink && edk template deploy -ycw "07_08_02_define_a_datasink"
	 cd 08_work_with_custom_tasks/01_custom_tasks/01_what_is_a_custom_task && edk template deploy -ycw "08_01_01_what_is_a_custom_task"
	 cd 08_work_with_custom_tasks/01_custom_tasks/02_define_a_custom_task && edk template deploy -ycw "08_01_02_define_a_custom_task"
	 cd 08_work_with_custom_tasks/02_custom_scenarios/01_what_is_a_custom_scenario && edk template deploy -ycw "08_02_01_what_is_a_custom_scenario"
	 cd 08_work_with_custom_tasks/02_custom_scenarios/02_define_a_custom_scenario && edk template deploy -ycw "08_02_02_define_a_custom_scenario"
	 cd 08_work_with_custom_tasks/02_custom_scenarios/03_optimize_a_custom_scenario && edk template deploy -ycw "08_02_03_optimize_a_custom_scenario"

.PHONY: install
install:
	 cd 01_manage_solutions/01_understand_solutions/01_what_is_elara && npm i
	 cd 01_manage_solutions/01_understand_solutions/02_why_use_elara && npm i
	 cd 01_manage_solutions/01_understand_solutions/03_how_is_elara_used && npm i
	 cd 02_manage_the_platform/01_setup_your_dev_environment/01_install_edk_cli && npm i
	 cd 02_manage_the_platform/01_setup_your_dev_environment/02_log_in && npm i
	 cd 02_manage_the_platform/01_setup_your_dev_environment/03_initialise_a_project && npm i
	 cd 02_manage_the_platform/01_setup_your_dev_environment/04_learn_typescript_fundamentals && npm i
	 cd 02_manage_the_platform/02_manage_access/01_manage_users && npm i
	 cd 02_manage_the_platform/02_manage_access/02_manage_platform_roles && npm i
	 cd 02_manage_the_platform/03_manage_tenants/01_create_and_delete_tenants && npm i
	 cd 02_manage_the_platform/03_manage_tenants/02_manage_tenant_users && npm i
	 cd 02_manage_the_platform/03_manage_tenants/03_manage_tenant_roles && npm i
	 cd 02_manage_the_platform/03_manage_tenants/04_manage_tenant_usage && npm i
	 cd 03_work_with_data/01_get_data_in_and_out/01_what_is_a_datastream && npm i
	 cd 03_work_with_data/01_get_data_in_and_out/02_what_is_a_datasource && npm i
	 cd 03_work_with_data/01_get_data_in_and_out/03_define_a_datasource && npm i
	 cd 03_work_with_data/01_get_data_in_and_out/04_launch_a_solution && npm i
	 cd 03_work_with_data/01_get_data_in_and_out/05_view_datastream_status && npm i
	 cd 03_work_with_data/01_get_data_in_and_out/06_write_data_to_a_datastream && npm i
	 cd 03_work_with_data/01_get_data_in_and_out/07_read_a_datastream_value && npm i
	 cd 03_work_with_data/01_get_data_in_and_out/08_delete_a_value_in_a_datastream && npm i
	 cd 03_work_with_data/01_get_data_in_and_out/09_define_a_value_datasource && npm i
	 cd 03_work_with_data/02_transform_data/01_what_is_a_pipeline && npm i
	 cd 03_work_with_data/02_transform_data/02_define_and_launch_a_pipeline && npm i
	 cd 03_work_with_data/02_transform_data/03_define_a_pipeline_operation && npm i
	 cd 03_work_with_data/02_transform_data/04_what_are_expressions && npm i
	 cd 03_work_with_data/02_transform_data/05_define_an_expression && npm i
	 cd 03_work_with_data/02_transform_data/06_input_streams_into_a_pipeline && npm i
	 cd 03_work_with_data/02_transform_data/07_handle_missing_values && npm i
	 cd 03_work_with_data/02_transform_data/08_what_is_a_function && npm i
	 cd 03_work_with_data/02_transform_data/09_define_and_launch_a_function && npm i
	 cd 03_work_with_data/03_monitor_solutions/01_what_is_a_task && npm i
	 cd 03_work_with_data/03_monitor_solutions/02_monitor_tasks && npm i
	 cd 03_work_with_data/04_validate_data/01_what_are_errors_and_warnings && npm i
	 cd 03_work_with_data/04_validate_data/02_define_errors_and_warnings && npm i
	 cd 03_work_with_data/05_use_complex_data_types/01_what_are_complex_types && npm i
	 cd 03_work_with_data/05_use_complex_data_types/02_use_a_collection_type && npm i
	 cd 03_work_with_data/05_use_complex_data_types/03_use_a_compound_type && npm i
	 cd 03_work_with_data/06_transform_collection_data/01_what_are_collection_operations && npm i
	 cd 03_work_with_data/06_transform_collection_data/02_validate_a_collection && npm i
	 cd 03_work_with_data/06_transform_collection_data/03_filter_a_collection && npm i
	 cd 03_work_with_data/06_transform_collection_data/04_aggregate_a_collection && npm i
	 cd 03_work_with_data/06_transform_collection_data/05_select_a_collection && npm i
	 cd 03_work_with_data/06_transform_collection_data/06_disaggregate_a_collection_field && npm i
	 cd 03_work_with_data/06_transform_collection_data/07_join_collections && npm i
	 cd 03_work_with_data/06_transform_collection_data/08_concatenate_collections && npm i
	 cd 03_work_with_data/06_transform_collection_data/09_offset_a_collection_datastream && npm i
	 cd 03_work_with_data/07_visualise_data/01_what_is_a_layout && npm i
	 cd 03_work_with_data/07_visualise_data/02_define_a_table_visual && npm i
	 cd 03_work_with_data/07_visualise_data/03_define_a_vega_visual && npm i
	 cd 03_work_with_data/07_visualise_data/04_define_a_tabbed_visual && npm i
	 cd 03_work_with_data/07_visualise_data/05_define_a_panelled_visual && npm i
	 cd 04_work_with_models/03_build_a_model/01_define_a_descriptive_scenario && npm i
	 cd 04_work_with_models/03_build_a_model/02_whats_an_ml_builder && npm i
	 cd 04_work_with_models/03_build_a_model/03_define_a_predictive_scenario && npm i
	 cd 04_work_with_models/03_build_a_model/04_define_a_prescriptive_scenario && npm i
	 cd 04_work_with_models/03_build_a_model/05_define_an_interactive_scenario && npm i
	 cd 05_use_expressions/01_introduction_to_east/01_why_east && npm i
	 cd 05_use_expressions/01_introduction_to_east/02_east_values_and_types && npm i
	 cd 05_use_expressions/01_introduction_to_east/03_east_expressions && npm i
	 cd 05_use_expressions/02_primitive_data/01_boolean_logic && npm i
	 cd 05_use_expressions/02_primitive_data/02_integers_and_floats && npm i
	 cd 05_use_expressions/02_primitive_data/03_strings && npm i
	 cd 05_use_expressions/02_primitive_data/04_datetime && npm i
	 cd 05_use_expressions/02_primitive_data/05_null && npm i
	 cd 05_use_expressions/02_primitive_data/06_equality_and_ordering && npm i
	 cd 05_use_expressions/03_compound_data/01_structs && npm i
	 cd 05_use_expressions/03_compound_data/02_variants && npm i
	 cd 05_use_expressions/03_compound_data/03_subtypes && npm i
	 cd 05_use_expressions/04_data_collections/01_arrays && npm i
	 cd 05_use_expressions/04_data_collections/02_sets && npm i
	 cd 05_use_expressions/04_data_collections/03_dictionaries && npm i
	 cd 05_use_expressions/04_data_collections/04_filtering && npm i
	 cd 05_use_expressions/04_data_collections/05_transforming && npm i
	 cd 05_use_expressions/04_data_collections/06_reduction && npm i
	 cd 05_use_expressions/04_data_collections/07_aggregation && npm i
	 cd 05_use_expressions/05_blob_data/01_basics && npm i
	 cd 05_use_expressions/05_blob_data/02_string_conversion && npm i
	 cd 05_use_expressions/05_blob_data/03_csv_conversion && npm i
	 cd 05_use_expressions/06_advanced_topics/01_random && npm i
	 cd 05_use_expressions/06_advanced_topics/02_machine_learning && npm i
	 cd 05_use_expressions/06_advanced_topics/03_mutation && npm i
	 cd 06_work_with_complex_data/01_patch_data/01_what_is_a_patch_source && npm i
	 cd 06_work_with_complex_data/01_patch_data/02_define_a_patch_source && npm i
	 cd 06_work_with_complex_data/03_use_blobtype_data/01_what_is_the_blob_type && npm i
	 cd 06_work_with_complex_data/03_use_blobtype_data/02_define_a_blobtype && npm i
	 cd 06_work_with_complex_data/03_use_blobtype_data/03_validate_a_blobtype && npm i
	 cd 06_work_with_complex_data/03_use_blobtype_data/04_what_are_blobtype_operations && npm i
	 cd 06_work_with_complex_data/03_use_blobtype_data/05_define_a_file_datasource && npm i
	 cd 06_work_with_complex_data/03_use_blobtype_data/06_parse_from_blob_data && npm i
	 cd 06_work_with_complex_data/03_use_blobtype_data/07_unparse_to_blob_data && npm i
	 cd 06_work_with_complex_data/04_use_varianttype_data/01_what_is_the_variant_data_type && npm i
	 cd 06_work_with_complex_data/04_use_varianttype_data/02_define_a_varianttype && npm i
	 cd 06_work_with_complex_data/04_use_varianttype_data/03_use_varianttype_data && npm i
	 cd 07_ingest_and_transform_data/01_ingest_data/01_set_value_from_local_file && npm i
	 cd 07_ingest_and_transform_data/01_ingest_data/02_set_value_programmatically && npm i
	 cd 07_ingest_and_transform_data/01_ingest_data/03_read_data_using_the_cli && npm i
	 cd 07_ingest_and_transform_data/01_ingest_data/04_write_data_using_the_cli && npm i
	 cd 07_ingest_and_transform_data/01_ingest_data/05_stream_data_from_ftp && npm i
	 cd 07_ingest_and_transform_data/01_ingest_data/06_stream_data_from_api && npm i
	 cd 07_ingest_and_transform_data/01_ingest_data/07_stream_data_from_s3 && npm i
	 cd 07_ingest_and_transform_data/01_ingest_data/08_ingest_with_cron && npm i
	 cd 07_ingest_and_transform_data/02_transform_data/01_use_a_random_expression && npm i
	 cd 07_ingest_and_transform_data/02_transform_data/02_use_a_range_expression && npm i
	 cd 07_ingest_and_transform_data/02_transform_data/03_use_a_reduce_expression && npm i
	 cd 07_ingest_and_transform_data/08_send_data_out/01_what_is_a_datasink && npm i
	 cd 07_ingest_and_transform_data/08_send_data_out/02_define_a_datasink && npm i
	 cd 08_work_with_custom_tasks/01_custom_tasks/01_what_is_a_custom_task && npm i
	 cd 08_work_with_custom_tasks/01_custom_tasks/02_define_a_custom_task && npm i
	 cd 08_work_with_custom_tasks/02_custom_scenarios/01_what_is_a_custom_scenario && npm i
	 cd 08_work_with_custom_tasks/02_custom_scenarios/02_define_a_custom_scenario && npm i
	 cd 08_work_with_custom_tasks/02_custom_scenarios/03_optimize_a_custom_scenario && npm i

.PHONY: build
build:
	 cd 01_manage_solutions/01_understand_solutions/01_what_is_elara && edk template build
	 cd 01_manage_solutions/01_understand_solutions/02_why_use_elara && edk template build
	 cd 01_manage_solutions/01_understand_solutions/03_how_is_elara_used && edk template build
	 cd 02_manage_the_platform/01_setup_your_dev_environment/01_install_edk_cli && edk template build
	 cd 02_manage_the_platform/01_setup_your_dev_environment/02_log_in && edk template build
	 cd 02_manage_the_platform/01_setup_your_dev_environment/03_initialise_a_project && edk template build
	 cd 02_manage_the_platform/01_setup_your_dev_environment/04_learn_typescript_fundamentals && edk template build
	 cd 02_manage_the_platform/02_manage_access/01_manage_users && edk template build
	 cd 02_manage_the_platform/02_manage_access/02_manage_platform_roles && edk template build
	 cd 02_manage_the_platform/03_manage_tenants/01_create_and_delete_tenants && edk template build
	 cd 02_manage_the_platform/03_manage_tenants/02_manage_tenant_users && edk template build
	 cd 02_manage_the_platform/03_manage_tenants/03_manage_tenant_roles && edk template build
	 cd 02_manage_the_platform/03_manage_tenants/04_manage_tenant_usage && edk template build
	 cd 03_work_with_data/01_get_data_in_and_out/01_what_is_a_datastream && edk template build
	 cd 03_work_with_data/01_get_data_in_and_out/02_what_is_a_datasource && edk template build
	 cd 03_work_with_data/01_get_data_in_and_out/03_define_a_datasource && edk template build
	 cd 03_work_with_data/01_get_data_in_and_out/04_launch_a_solution && edk template build
	 cd 03_work_with_data/01_get_data_in_and_out/05_view_datastream_status && edk template build
	 cd 03_work_with_data/01_get_data_in_and_out/06_write_data_to_a_datastream && edk template build
	 cd 03_work_with_data/01_get_data_in_and_out/07_read_a_datastream_value && edk template build
	 cd 03_work_with_data/01_get_data_in_and_out/08_delete_a_value_in_a_datastream && edk template build
	 cd 03_work_with_data/01_get_data_in_and_out/09_define_a_value_datasource && edk template build
	 cd 03_work_with_data/02_transform_data/01_what_is_a_pipeline && edk template build
	 cd 03_work_with_data/02_transform_data/02_define_and_launch_a_pipeline && edk template build
	 cd 03_work_with_data/02_transform_data/03_define_a_pipeline_operation && edk template build
	 cd 03_work_with_data/02_transform_data/04_what_are_expressions && edk template build
	 cd 03_work_with_data/02_transform_data/05_define_an_expression && edk template build
	 cd 03_work_with_data/02_transform_data/06_input_streams_into_a_pipeline && edk template build
	 cd 03_work_with_data/02_transform_data/07_handle_missing_values && edk template build
	 cd 03_work_with_data/02_transform_data/08_what_is_a_function && edk template build
	 cd 03_work_with_data/02_transform_data/09_define_and_launch_a_function && edk template build
	 cd 03_work_with_data/03_monitor_solutions/01_what_is_a_task && edk template build
	 cd 03_work_with_data/03_monitor_solutions/02_monitor_tasks && edk template build
	 cd 03_work_with_data/04_validate_data/01_what_are_errors_and_warnings && edk template build
	 cd 03_work_with_data/04_validate_data/02_define_errors_and_warnings && edk template build
	 cd 03_work_with_data/05_use_complex_data_types/01_what_are_complex_types && edk template build
	 cd 03_work_with_data/05_use_complex_data_types/02_use_a_collection_type && edk template build
	 cd 03_work_with_data/05_use_complex_data_types/03_use_a_compound_type && edk template build
	 cd 03_work_with_data/06_transform_collection_data/01_what_are_collection_operations && edk template build
	 cd 03_work_with_data/06_transform_collection_data/02_validate_a_collection && edk template build
	 cd 03_work_with_data/06_transform_collection_data/03_filter_a_collection && edk template build
	 cd 03_work_with_data/06_transform_collection_data/04_aggregate_a_collection && edk template build
	 cd 03_work_with_data/06_transform_collection_data/05_select_a_collection && edk template build
	 cd 03_work_with_data/06_transform_collection_data/06_disaggregate_a_collection_field && edk template build
	 cd 03_work_with_data/06_transform_collection_data/07_join_collections && edk template build
	 cd 03_work_with_data/06_transform_collection_data/08_concatenate_collections && edk template build
	 cd 03_work_with_data/06_transform_collection_data/09_offset_a_collection_datastream && edk template build
	 cd 03_work_with_data/07_visualise_data/01_what_is_a_layout && edk template build
	 cd 03_work_with_data/07_visualise_data/02_define_a_table_visual && edk template build
	 cd 03_work_with_data/07_visualise_data/03_define_a_vega_visual && edk template build
	 cd 03_work_with_data/07_visualise_data/04_define_a_tabbed_visual && edk template build
	 cd 03_work_with_data/07_visualise_data/05_define_a_panelled_visual && edk template build
	 cd 04_work_with_models/03_build_a_model/01_define_a_descriptive_scenario && edk template build
	 cd 04_work_with_models/03_build_a_model/02_whats_an_ml_builder && edk template build
	 cd 04_work_with_models/03_build_a_model/03_define_a_predictive_scenario && edk template build
	 cd 04_work_with_models/03_build_a_model/04_define_a_prescriptive_scenario && edk template build
	 cd 04_work_with_models/03_build_a_model/05_define_an_interactive_scenario && edk template build
	 cd 05_use_expressions/01_introduction_to_east/01_why_east && edk template build
	 cd 05_use_expressions/01_introduction_to_east/02_east_values_and_types && edk template build
	 cd 05_use_expressions/01_introduction_to_east/03_east_expressions && edk template build
	 cd 05_use_expressions/02_primitive_data/01_boolean_logic && edk template build
	 cd 05_use_expressions/02_primitive_data/02_integers_and_floats && edk template build
	 cd 05_use_expressions/02_primitive_data/03_strings && edk template build
	 cd 05_use_expressions/02_primitive_data/04_datetime && edk template build
	 cd 05_use_expressions/02_primitive_data/05_null && edk template build
	 cd 05_use_expressions/02_primitive_data/06_equality_and_ordering && edk template build
	 cd 05_use_expressions/03_compound_data/01_structs && edk template build
	 cd 05_use_expressions/03_compound_data/02_variants && edk template build
	 cd 05_use_expressions/03_compound_data/03_subtypes && edk template build
	 cd 05_use_expressions/04_data_collections/01_arrays && edk template build
	 cd 05_use_expressions/04_data_collections/02_sets && edk template build
	 cd 05_use_expressions/04_data_collections/03_dictionaries && edk template build
	 cd 05_use_expressions/04_data_collections/04_filtering && edk template build
	 cd 05_use_expressions/04_data_collections/05_transforming && edk template build
	 cd 05_use_expressions/04_data_collections/06_reduction && edk template build
	 cd 05_use_expressions/04_data_collections/07_aggregation && edk template build
	 cd 05_use_expressions/05_blob_data/01_basics && edk template build
	 cd 05_use_expressions/05_blob_data/02_string_conversion && edk template build
	 cd 05_use_expressions/05_blob_data/03_csv_conversion && edk template build
	 cd 05_use_expressions/06_advanced_topics/01_random && edk template build
	 cd 05_use_expressions/06_advanced_topics/02_machine_learning && edk template build
	 cd 05_use_expressions/06_advanced_topics/03_mutation && edk template build
	 cd 06_work_with_complex_data/01_patch_data/01_what_is_a_patch_source && edk template build
	 cd 06_work_with_complex_data/01_patch_data/02_define_a_patch_source && edk template build
	 cd 06_work_with_complex_data/03_use_blobtype_data/01_what_is_the_blob_type && edk template build
	 cd 06_work_with_complex_data/03_use_blobtype_data/02_define_a_blobtype && edk template build
	 cd 06_work_with_complex_data/03_use_blobtype_data/03_validate_a_blobtype && edk template build
	 cd 06_work_with_complex_data/03_use_blobtype_data/04_what_are_blobtype_operations && edk template build
	 cd 06_work_with_complex_data/03_use_blobtype_data/05_define_a_file_datasource && edk template build
	 cd 06_work_with_complex_data/03_use_blobtype_data/06_parse_from_blob_data && edk template build
	 cd 06_work_with_complex_data/03_use_blobtype_data/07_unparse_to_blob_data && edk template build
	 cd 06_work_with_complex_data/04_use_varianttype_data/01_what_is_the_variant_data_type && edk template build
	 cd 06_work_with_complex_data/04_use_varianttype_data/02_define_a_varianttype && edk template build
	 cd 06_work_with_complex_data/04_use_varianttype_data/03_use_varianttype_data && edk template build
	 cd 07_ingest_and_transform_data/01_ingest_data/01_set_value_from_local_file && edk template build
	 cd 07_ingest_and_transform_data/01_ingest_data/02_set_value_programmatically && edk template build
	 cd 07_ingest_and_transform_data/01_ingest_data/03_read_data_using_the_cli && edk template build
	 cd 07_ingest_and_transform_data/01_ingest_data/04_write_data_using_the_cli && edk template build
	 cd 07_ingest_and_transform_data/01_ingest_data/05_stream_data_from_ftp && edk template build
	 cd 07_ingest_and_transform_data/01_ingest_data/06_stream_data_from_api && edk template build
	 cd 07_ingest_and_transform_data/01_ingest_data/07_stream_data_from_s3 && edk template build
	 cd 07_ingest_and_transform_data/01_ingest_data/08_ingest_with_cron && edk template build
	 cd 07_ingest_and_transform_data/02_transform_data/01_use_a_random_expression && edk template build
	 cd 07_ingest_and_transform_data/02_transform_data/02_use_a_range_expression && edk template build
	 cd 07_ingest_and_transform_data/02_transform_data/03_use_a_reduce_expression && edk template build
	 cd 07_ingest_and_transform_data/08_send_data_out/01_what_is_a_datasink && edk template build
	 cd 07_ingest_and_transform_data/08_send_data_out/02_define_a_datasink && edk template build
	 cd 08_work_with_custom_tasks/01_custom_tasks/01_what_is_a_custom_task && edk template build
	 cd 08_work_with_custom_tasks/01_custom_tasks/02_define_a_custom_task && edk template build
	 cd 08_work_with_custom_tasks/02_custom_scenarios/01_what_is_a_custom_scenario && edk template build
	 cd 08_work_with_custom_tasks/02_custom_scenarios/02_define_a_custom_scenario && edk template build
	 cd 08_work_with_custom_tasks/02_custom_scenarios/03_optimize_a_custom_scenario && edk template build

.PHONY: delete
delete:
	cd 01_manage_solutions/01_understand_solutions/01_what_is_elara && edk workspace delete "01_01_01_what_is_elara"
	cd 01_manage_solutions/01_understand_solutions/02_why_use_elara && edk workspace delete "01_01_02_why_use_elara"
	cd 01_manage_solutions/01_understand_solutions/03_how_is_elara_used && edk workspace delete "01_01_03_how_is_elara_used"
	cd 02_manage_the_platform/01_setup_your_dev_environment/01_install_edk_cli && edk workspace delete "02_01_01_install_edk_cli"
	cd 02_manage_the_platform/01_setup_your_dev_environment/02_log_in && edk workspace delete "02_01_02_log_in"
	cd 02_manage_the_platform/01_setup_your_dev_environment/03_initialise_a_project && edk workspace delete "02_01_03_initialise_a_project"
	cd 02_manage_the_platform/01_setup_your_dev_environment/04_learn_typescript_fundamentals && edk workspace delete "02_01_04_learn_typescript_fundamentals"
	cd 02_manage_the_platform/02_manage_access/01_manage_users && edk workspace delete "02_02_01_manage_users"
	cd 02_manage_the_platform/02_manage_access/02_manage_platform_roles && edk workspace delete "02_02_02_manage_platform_roles"
	cd 02_manage_the_platform/03_manage_tenants/01_create_and_delete_tenants && edk workspace delete "02_03_01_create_and_delete_tenants"
	cd 02_manage_the_platform/03_manage_tenants/02_manage_tenant_users && edk workspace delete "02_03_02_manage_tenant_users"
	cd 02_manage_the_platform/03_manage_tenants/03_manage_tenant_roles && edk workspace delete "02_03_03_manage_tenant_roles"
	cd 02_manage_the_platform/03_manage_tenants/04_manage_tenant_usage && edk workspace delete "02_03_04_manage_tenant_usage"
	cd 03_work_with_data/01_get_data_in_and_out/01_what_is_a_datastream && edk workspace delete "03_01_01_what_is_a_datastream"
	cd 03_work_with_data/01_get_data_in_and_out/02_what_is_a_datasource && edk workspace delete "03_01_02_what_is_a_datasource"
	cd 03_work_with_data/01_get_data_in_and_out/03_define_a_datasource && edk workspace delete "03_01_03_define_a_datasource"
	cd 03_work_with_data/01_get_data_in_and_out/04_launch_a_solution && edk workspace delete "03_01_04_launch_a_solution"
	cd 03_work_with_data/01_get_data_in_and_out/05_view_datastream_status && edk workspace delete "03_01_05_view_datastream_status"
	cd 03_work_with_data/01_get_data_in_and_out/06_write_data_to_a_datastream && edk workspace delete "03_01_06_write_data_to_a_datastream"
	cd 03_work_with_data/01_get_data_in_and_out/07_read_a_datastream_value && edk workspace delete "03_01_07_read_a_datastream_value"
	cd 03_work_with_data/01_get_data_in_and_out/08_delete_a_value_in_a_datastream && edk workspace delete "03_01_08_delete_a_value_in_a_datastream"
	cd 03_work_with_data/01_get_data_in_and_out/09_define_a_value_datasource && edk workspace delete "03_01_09_define_a_value_datasource"
	cd 03_work_with_data/02_transform_data/01_what_is_a_pipeline && edk workspace delete "03_02_01_what_is_a_pipeline"
	cd 03_work_with_data/02_transform_data/02_define_and_launch_a_pipeline && edk workspace delete "03_02_02_define_and_launch_a_pipeline"
	cd 03_work_with_data/02_transform_data/03_define_a_pipeline_operation && edk workspace delete "03_02_03_define_a_pipeline_operation"
	cd 03_work_with_data/02_transform_data/04_what_are_expressions && edk workspace delete "03_02_04_what_are_expressions"
	cd 03_work_with_data/02_transform_data/05_define_an_expression && edk workspace delete "03_02_05_define_an_expression"
	cd 03_work_with_data/02_transform_data/06_input_streams_into_a_pipeline && edk workspace delete "03_02_06_input_streams_into_a_pipeline"
	cd 03_work_with_data/02_transform_data/07_handle_missing_values && edk workspace delete "03_02_07_handle_missing_values"
	cd 03_work_with_data/02_transform_data/08_what_is_a_function && edk workspace delete "03_02_08_what_is_a_function"
	cd 03_work_with_data/02_transform_data/09_define_and_launch_a_function && edk workspace delete "03_02_09_define_and_launch_a_function"
	cd 03_work_with_data/03_monitor_solutions/01_what_is_a_task && edk workspace delete "03_03_01_what_is_a_task"
	cd 03_work_with_data/03_monitor_solutions/02_monitor_tasks && edk workspace delete "03_03_02_monitor_tasks"
	cd 03_work_with_data/04_validate_data/01_what_are_errors_and_warnings && edk workspace delete "03_04_01_what_are_errors_and_warnings"
	cd 03_work_with_data/04_validate_data/02_define_errors_and_warnings && edk workspace delete "03_04_02_define_errors_and_warnings"
	cd 03_work_with_data/05_use_complex_data_types/01_what_are_complex_types && edk workspace delete "03_05_01_what_are_complex_types"
	cd 03_work_with_data/05_use_complex_data_types/02_use_a_collection_type && edk workspace delete "03_05_02_use_a_collection_type"
	cd 03_work_with_data/05_use_complex_data_types/03_use_a_compound_type && edk workspace delete "03_05_03_use_a_compound_type"
	cd 03_work_with_data/06_transform_collection_data/01_what_are_collection_operations && edk workspace delete "03_06_01_what_are_collection_operations"
	cd 03_work_with_data/06_transform_collection_data/02_validate_a_collection && edk workspace delete "03_06_02_validate_a_collection"
	cd 03_work_with_data/06_transform_collection_data/03_filter_a_collection && edk workspace delete "03_06_03_filter_a_collection"
	cd 03_work_with_data/06_transform_collection_data/04_aggregate_a_collection && edk workspace delete "03_06_04_aggregate_a_collection"
	cd 03_work_with_data/06_transform_collection_data/05_select_a_collection && edk workspace delete "03_06_05_select_a_collection"
	cd 03_work_with_data/06_transform_collection_data/06_disaggregate_a_collection_field && edk workspace delete "03_06_06_disaggregate_a_collection_field"
	cd 03_work_with_data/06_transform_collection_data/07_join_collections && edk workspace delete "03_06_07_join_collections"
	cd 03_work_with_data/06_transform_collection_data/08_concatenate_collections && edk workspace delete "03_06_08_concatenate_collections"
	cd 03_work_with_data/06_transform_collection_data/09_offset_a_collection_datastream && edk workspace delete "03_06_09_offset_a_collection_datastream"
	cd 03_work_with_data/07_visualise_data/01_what_is_a_layout && edk workspace delete "03_07_01_what_is_a_layout"
	cd 03_work_with_data/07_visualise_data/02_define_a_table_visual && edk workspace delete "03_07_02_define_a_table_visual"
	cd 03_work_with_data/07_visualise_data/03_define_a_vega_visual && edk workspace delete "03_07_03_define_a_vega_visual"
	cd 03_work_with_data/07_visualise_data/04_define_a_tabbed_visual && edk workspace delete "03_07_04_define_a_tabbed_visual"
	cd 03_work_with_data/07_visualise_data/05_define_a_panelled_visual && edk workspace delete "03_07_05_define_a_panelled_visual"
	cd 04_work_with_models/03_build_a_model/01_define_a_descriptive_scenario && edk workspace delete "04_03_01_define_a_descriptive_scenario"
	cd 04_work_with_models/03_build_a_model/02_whats_an_ml_builder && edk workspace delete "04_03_02_whats_an_ml_builder"
	cd 04_work_with_models/03_build_a_model/03_define_a_predictive_scenario && edk workspace delete "04_03_03_define_a_predictive_scenario"
	cd 04_work_with_models/03_build_a_model/04_define_a_prescriptive_scenario && edk workspace delete "04_03_04_define_a_prescriptive_scenario"
	cd 04_work_with_models/03_build_a_model/05_define_an_interactive_scenario && edk workspace delete "04_03_05_define_an_interactive_scenario"	cd 05_use_expressions/01_introduction_to_east/01_why_east && edk workspace delete "05_01_01_why_east"
	cd 05_use_expressions/01_introduction_to_east/02_east_values_and_types && edk workspace delete "05_01_02_east_values_and_types"
	cd 05_use_expressions/01_introduction_to_east/03_east_expressions && edk workspace delete "05_01_03_east_expressions"
	cd 05_use_expressions/02_primitive_data/01_boolean_logic && edk workspace delete "05_02_01_boolean_logic"
	cd 05_use_expressions/02_primitive_data/02_integers_and_floats && edk workspace delete "05_02_02_integers_and_floats"
	cd 05_use_expressions/02_primitive_data/03_strings && edk workspace delete "05_02_03_strings"
	cd 05_use_expressions/02_primitive_data/04_datetime && edk workspace delete "05_02_04_datetime"
	cd 05_use_expressions/02_primitive_data/05_null && edk workspace delete "05_02_05_null"
	cd 05_use_expressions/02_primitive_data/06_equality_and_ordering && edk workspace delete "05_02_06_equality_and_ordering"
	cd 05_use_expressions/03_compound_data/01_structs && edk workspace delete "05_03_01_structs"
	cd 05_use_expressions/03_compound_data/02_variants && edk workspace delete "05_03_02_variants"
	cd 05_use_expressions/03_compound_data/03_subtypes && edk workspace delete "05_03_03_subtypes"
	cd 05_use_expressions/04_data_collections/01_arrays && edk workspace delete "05_04_01_arrays"
	cd 05_use_expressions/04_data_collections/02_sets && edk workspace delete "05_04_02_sets"
	cd 05_use_expressions/04_data_collections/03_dictionaries && edk workspace delete "05_04_03_dictionaries"
	cd 05_use_expressions/04_data_collections/04_filtering && edk workspace delete "05_04_04_filtering"
	cd 05_use_expressions/04_data_collections/05_transforming && edk workspace delete "05_04_05_transforming"
	cd 05_use_expressions/04_data_collections/06_reduction && edk workspace delete "05_04_06_reduction"
	cd 05_use_expressions/04_data_collections/07_aggregation && edk workspace delete "05_04_07_aggregation"
	cd 05_use_expressions/05_blob_data/01_basics && edk workspace delete "05_05_01_basics"
	cd 05_use_expressions/05_blob_data/02_string_conversion && edk workspace delete "05_05_02_string_conversion"
	cd 05_use_expressions/05_blob_data/03_csv_conversion && edk workspace delete "05_05_03_csv_conversion"
	cd 05_use_expressions/06_advanced_topics/01_random && edk workspace delete "05_06_01_random"
	cd 05_use_expressions/06_advanced_topics/02_machine_learning && edk workspace delete "05_06_02_machine_learning"
	cd 05_use_expressions/06_advanced_topics/03_mutation && edk workspace delete "05_06_03_mutation"
	cd 06_work_with_complex_data/01_patch_data/01_what_is_a_patch_source && edk workspace delete "06_01_01_what_is_a_patch_source"
	cd 06_work_with_complex_data/01_patch_data/02_define_a_patch_source && edk workspace delete "06_01_02_define_a_patch_source"
	cd 06_work_with_complex_data/03_use_blobtype_data/01_what_is_the_blob_type && edk workspace delete "06_03_01_what_is_the_blob_type"
	cd 06_work_with_complex_data/03_use_blobtype_data/02_define_a_blobtype && edk workspace delete "06_03_02_define_a_blobtype"
	cd 06_work_with_complex_data/03_use_blobtype_data/03_validate_a_blobtype && edk workspace delete "06_03_03_validate_a_blobtype"
	cd 06_work_with_complex_data/03_use_blobtype_data/04_what_are_blobtype_operations && edk workspace delete "06_03_04_what_are_blobtype_operations"
	cd 06_work_with_complex_data/03_use_blobtype_data/05_define_a_file_datasource && edk workspace delete "06_03_05_define_a_file_datasource"
	cd 06_work_with_complex_data/03_use_blobtype_data/06_parse_from_blob_data && edk workspace delete "06_03_06_parse_from_blob_data"
	cd 06_work_with_complex_data/03_use_blobtype_data/07_unparse_to_blob_data && edk workspace delete "06_03_07_unparse_to_blob_data"
	cd 06_work_with_complex_data/04_use_varianttype_data/01_what_is_the_variant_data_type && edk workspace delete "06_04_01_what_is_the_variant_data_type"
	cd 06_work_with_complex_data/04_use_varianttype_data/02_define_a_varianttype && edk workspace delete "06_04_02_define_a_varianttype"
	cd 06_work_with_complex_data/04_use_varianttype_data/03_use_varianttype_data && edk workspace delete "06_04_03_use_varianttype_data"
	cd 07_ingest_and_transform_data/01_ingest_data/01_set_value_from_local_file && edk workspace delete "07_01_01_set_value_from_local_file"
	cd 07_ingest_and_transform_data/01_ingest_data/02_set_value_programmatically && edk workspace delete "07_01_02_set_value_programmatically"
	cd 07_ingest_and_transform_data/01_ingest_data/03_read_data_using_the_cli && edk workspace delete "07_01_03_read_data_using_the_cli"
	cd 07_ingest_and_transform_data/01_ingest_data/04_write_data_using_the_cli && edk workspace delete "07_01_04_write_data_using_the_cli"
	cd 07_ingest_and_transform_data/01_ingest_data/05_stream_data_from_ftp && edk workspace delete "07_01_05_stream_data_from_ftp"
	cd 07_ingest_and_transform_data/01_ingest_data/06_stream_data_from_api && edk workspace delete "07_01_06_stream_data_from_api"
	cd 07_ingest_and_transform_data/01_ingest_data/07_stream_data_from_s3 && edk workspace delete "07_01_07_stream_data_from_s3"
	cd 07_ingest_and_transform_data/01_ingest_data/08_ingest_with_cron && edk workspace delete "07_01_08_ingest_with_cron"
	cd 07_ingest_and_transform_data/02_transform_data/01_use_a_random_expression && edk workspace delete "07_02_01_use_a_random_expression"
	cd 07_ingest_and_transform_data/02_transform_data/02_use_a_range_expression && edk workspace delete "07_02_02_use_a_range_expression"
	cd 07_ingest_and_transform_data/02_transform_data/03_use_a_reduce_expression && edk workspace delete "07_02_03_use_a_reduce_expression"
	cd 07_ingest_and_transform_data/08_send_data_out/01_what_is_a_datasink && edk workspace delete "07_08_01_what_is_a_datasink"
	cd 07_ingest_and_transform_data/08_send_data_out/02_define_a_datasink && edk workspace delete "07_08_02_define_a_datasink"
	cd 08_work_with_custom_tasks/01_custom_tasks/01_what_is_a_custom_task && edk workspace delete "08_01_01_what_is_a_custom_task"
	cd 08_work_with_custom_tasks/01_custom_tasks/02_define_a_custom_task && edk workspace delete "08_01_02_define_a_custom_task"
	cd 08_work_with_custom_tasks/02_custom_scenarios/01_what_is_a_custom_scenario && edk workspace delete "08_02_01_what_is_a_custom_scenario"
	cd 08_work_with_custom_tasks/02_custom_scenarios/02_define_a_custom_scenario && edk workspace delete "08_02_02_define_a_custom_scenario"
	cd 08_work_with_custom_tasks/02_custom_scenarios/03_optimize_a_custom_scenario && edk workspace delete "08_02_03_optimize_a_custom_scenario"