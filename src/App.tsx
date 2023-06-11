import {  useState, useCallback } from "react";
import "./App.css";
import { getItemCategory } from "./utils";
import {
  type ChatCompletion,
  type TodoCategory,
  type TodoItem,
  todoCategories,
} from "./types";

function App() {
  return (
    <>
      <TodoList />
    </>
  );
}

export default App;

const seedTodos: TodoItem[] = [
  {
    id: 1,
    text: "Milk",
    completed: false,
    category: "Dairy and eggs",
  },
  {
    id: 2,
    text: "Eggs",
    completed: false,
    category: "Dairy and eggs",
  },
  {
    id: 3,
    text: "Bread",
    completed: false,
    category: "Breads and bakery",
  },
  {
    id: 4,
    text: "Butter",
    completed: false,
    category: "Dairy and eggs",
  },
  {
    id: 5,
    text: "Cheese",
    completed: false,
    category: "Dairy and eggs",
  },
  {
    id: 6,
    text: "Apples",
    completed: false,
    category: "Fruits and vegetables",
  },
];

async function fetchItemCategory(item: string) {
  const response = await getItemCategory(item.toLowerCase());

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const data = response.body;
  if (!data) {
    return;
  }

  const reader = data.getReader();
  const decoder = new TextDecoder("utf-8");

  let result = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    if (value) {
      result += decoder.decode(value);
    }
  }

  try {
    const json = JSON.parse(result) as ChatCompletion;

    if (!json?.choices?.length) {
      throw new Error("Something went wrong.");
    }

    const choice = json.choices[0];

    return choice?.message?.content?.replace(".", "") as TodoCategory;
  } catch {
    throw new Error("Something went wrong.");
  }
}

function TodoList() {
  const [todos, setTodos] = useState<TodoItem[]>(seedTodos);
  const [newTodoItemText, setNewTodoItemText] = useState("");

  async function addTodo() {
    const newId = todos.length + 1;
    // check if newTodoItemText is empty
    if (newTodoItemText === "") {
      return;
    }

    // check if newTodoItemText already exists
    if (
      todos.some(
        (todo) => todo.text.toLowerCase() === newTodoItemText.toLowerCase()
      )
    ) {
      setNewTodoItemText("");
      return;
    }

    const category = await fetchItemCategory(newTodoItemText);
    if (!category) {
      return;
    }

    const newItem: TodoItem = {
      id: newId,
      text: newTodoItemText,
      completed: false,
      category,
    };

    setTodos([...todos, newItem]);

    setNewTodoItemText("");
  }

  function removeTodo(itemId: number) {
    setTodos(todos.filter((todo) => todo.id !== itemId));
  }

  const todosByCategory = useCallback(() => {
    const todosByCategory: Record<TodoCategory, TodoItem[]> =
      todoCategories.reduce(
        (acc, category) => ({ ...acc, [category]: [] }),
        {} as Record<TodoCategory, TodoItem[]>
      );

    todos.forEach((todo) => {
      todosByCategory[todo.category].push(todo);
    });

    return todosByCategory;
  }, [todos]);

  return (
    <div className="min-h-screen p-4 max-w-sm">
      <h1 className="text-2xl font-semibold mb-4">
        Grocery List w/auto categories
      </h1>
      <div>
        {Object.entries(todosByCategory()).map(([category, todos]) => {
          if (!todos.length) {
            return null;
          }
          return (
            <div key={category} className="my-4 space-y-2">
              <h2 className="font-bold">{category}</h2>
              <div>
                {todos.map((todo) => (
                  <TodoItem key={todo.id} todo={todo} removeTodo={removeTodo} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex">

      <input
        type="text"
        className="border border-gray-300 rounded-l-md px-4 py-2 w-full "
        value={newTodoItemText}
        onChange={(event) => {
          setNewTodoItemText(event.target.value);
        }}
        onKeyDown={async (event) => {
          if (event.key === "Enter") {
            await addTodo();
          }
        }}
      />
      <button
      className="rounded-r-md bg-blue-500 text-white px-4 flex-shrink-0"
        onClick={() => {
          addTodo();
        }}
      >
        Add item
      </button>
      </div>
    </div>
  );
}

function TodoItem({
  todo,
  removeTodo,
}: {
  todo: TodoItem;
  removeTodo: (itemId: number) => void;
}) {
  return (
    <div className="flex gap-4 justify-between">
      <div>{todo.text}</div>
      <button
        onClick={() => {
          removeTodo(todo.id);
        }}
      >
        &times;
      </button>
    </div>
  );
}
