import {
  SourceBuilder,
  Template,
  LayoutBuilder,
  GetField,
  Size,
} from "@elaraai/core";

// 1. Create a typescript date object to sue as the initial date
const initial = new Date("2024-06-03T09:00:00.000Z");

// 2. Define a source with a value that contains a Map and struct with array of tasks
const my_source = new SourceBuilder("My Source").value({
  value: new Map(Array.from({ length: 20 }).map((_, i) => [
    `EMP #${i}`,
    {
      Tasks: Array.from({ length: 20 }).map((day, j) => {
        const start = new Date(initial.setDate(initial.getDate() + j));
        const end = new Date(initial.setDate(initial.getHours() + 10));
        return { label: `Task ${j}-${day}`, start, end };
      }),
    },
  ])),
});

// 3. Define a layout with a timeline that displays the source with a key, tasks and computed hours
const my_layout = new LayoutBuilder("My Layout").timeline(
  "My Timeline",
  (builder) =>
    builder
      .fromStream(my_source.outputStream())
      // 3.1 Define the key with a custom label
      .key((builder) => builder.label("Employee ID"))
      // 3.2 Define the tasks with a custom background color
      .taskArray(
        "Tasks",
        (builder) => builder
          .value((builder) => builder.background("#C1C5C8"))
      )
      // 3.3 Define the number of tasks from the size of Tasks, with a custom background
      .computed(
        "No. Tasks",
        (context) => Size(GetField(context.parent.value, "Tasks")),
        (builder) => builder
          .background("lightgrey")
      )
);

// 4. Export the source and layout in a Template
export default Template(my_source, my_layout);
