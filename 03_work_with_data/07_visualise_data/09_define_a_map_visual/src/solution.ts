import {
  SourceBuilder,
  Template,
  LayoutBuilder,
  PipelineBuilder,
  Const,
  ToFeatureCollection,
} from "@elaraai/core";

// 1. Define a source with a file containing valid GeoJSON data
const my_source = new SourceBuilder("My Source")
  .file({ path: "./data/locations.geojson" });

// 2. Define a pipeline that takes the output stream of the source and converts it to GeoJSON
const my_pipeline = new PipelineBuilder("My Pipeline")
  .from(my_source.outputStream())
  .fromGeoJson();

// 3. Define a layout with a map that displays the GeoJSON data, with a default viewport and a layer called States
const my_layout = new LayoutBuilder("My Layout").map("Map", (builder) =>
  builder
    .fromStream(my_pipeline.outputStream())
    // 3.1 Set the default viewport to Australia
    .viewport(() =>
      Const({
        center: {
          coordinates: { x: -25.2744, y: 133.7751 },
        },
        zoom: 4,
      })
    )
    // 3.2 Add a layer called States that displays the GeoJSON data
    .layer("States", {
      geometry: (context) => ToFeatureCollection(context.value),
      visible: true,
    })
);

// 4. Export the source, pipeline, and layout in a Template
export default Template(my_source, my_pipeline, my_layout);
