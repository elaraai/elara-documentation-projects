import { SourceBuilder, Template, LayoutBuilder } from "@elaraai/core";

// 1. Define a source with a value that contains a Map
const my_source = new SourceBuilder("My Source").value({
  value: new Map(Array.from({ length: 100 }).map((_, index) => [
    `${index}`,
    {
      date: new Date(new Date().valueOf() + index * 3600 * 1000),
      category: `category ${index % 4}`,
      value: BigInt(Math.round(200 * Math.sin((Math.PI * index) / 100))),
    },
  ])
  ),
});

// 2. Define a layout with a split that contains a table and a vega chart that displays the source
const my_layout = new LayoutBuilder("My Layout").split("column", (builder) => builder
  // 2.1 Add a table to the left hand side of the split
  .left((builder) => builder.table("My Table", (builder) => builder
    .fromStream(my_source.outputStream())
    .columns()
  ))
  // 2.2 Add a vega chart to the right hand side of the split
  .right((builder) => builder.vega("My Chart", (builder) => builder
    .view((builder) => builder.fromStream(my_source.outputStream()).scatter({
      x: (builder) => builder.value((fields) => fields.date).sort("ascending"),
      y: (builder) => builder.value((fields) => fields.value),
    }))
  ))
);

// 3. Export the source and layout in a Template
export default Template(my_source, my_layout);
