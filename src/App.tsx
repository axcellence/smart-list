import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ListPlusIcon } from "lucide-react";
import "./App.css";
import { getItemCategory } from "./utils";
import {
  type ChatCompletion,
  type TodoCategory,
  type TodoItem,
  todoCategories,
} from "./types";
import CategoryExamples from "./data.json";

export default function App() {
  return (
    <>
      <TodoList />
    </>
  );
}

async function fetchItemCategory(item: string) {
  // check if item is in CategoryExamples
  const inExample = Object.entries(CategoryExamples).find(([category, items]) =>
    items.includes(item)
  );

  if (inExample) {
    return inExample[0] as TodoCategory;

  }

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
      if (!todo.category) {
        return;
      }
      if (!todosByCategory[todo.category]) {
        todosByCategory[todo.category] = [];
      }
      todosByCategory[todo.category]?.push(todo);
    });

    return todosByCategory;
  }, [todos]);

  return (
    <div className="min-h-screen max-w-sm flex flex-col pt-4 text-zinc-700">
      <h1 className="text-2xl font-semibold mb-4 px-4">
        Grocery List w/auto categories
      </h1>
      <motion.div layout className="p-4">
        <AnimatePresence>
          {Object.entries(todosByCategory()).map(([category, todos]) => {
            if (!todos.length) {
              return null;
            }
            return (
              <motion.div
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                }}
                key={category}
                className="my-4 space-y-2"
              >
                <h2 className="font-bold">{category}</h2>
                <div>
                  <AnimatePresence>
                    {todos.map((todo) => (
                      <TodoItem
                        key={todo.id}
                        todo={todo}
                        removeTodo={removeTodo}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
      <div className="mt-auto">
        <div className="flex border-t">
          <input
            type="text"
            className="px-4 py-3 w-full "
            value={newTodoItemText}
            placeholder="Broccoli, bananas, etc."
            onChange={(event) => {
              setNewTodoItemText(event.target.value);
            }}
            onKeyDown={async (event) => {
              if (event.key === "Enter") {
                await addTodo();
              }
            }}
          />
          <AnimatePresence>
            {newTodoItemText.length > 3 && (
              <motion.button
                initial={{
                  opacity: 0,
                  scaleX: 0,
                }}
                animate={{
                  opacity: 1,
                  scaleX: 1,
                }}
                className="flex gap-2 items-center rounded-r-md bg-blue-500 text-white px-3 flex-shrink-0"
                onClick={() => {
                  addTodo();
                }}
              >
                <ListPlusIcon className="w-5 h-5" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
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
  const variants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
    },
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="flex gap-4 justify-between"
    >
      <div>{todo.text}</div>
      <button
        onClick={() => {
          removeTodo(todo.id);
        }}
      >
        &times;
      </button>
    </motion.div>
  );
}
