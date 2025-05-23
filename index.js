import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import axios from "axios";
import { z } from "zod";

const API_URL = "https://todolist-api.hexschool.io";

const server = new McpServer({
  name: "hexschool-todolist",
  version: "1.0.0",
});

server.tool(
  "hexschool_todolist_sign_up",
  "註冊一個帳號",
  {
    email: z.string().email(),
    password: z.string(),
    nickname: z.string(),
  },
  async (input) => {
    const { email, password, nickname } = input;
    try {
      const res = await axios.post(`${API_URL}/users/sign_up`, {
        email,
        password,
        nickname,
      });

      return {
        content: [{
          type: "text",
          text: `status: ${res.data.status}, uid: ${res.data.uid}`,
        }]
      }
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `註冊失敗，錯誤訊息: ${error.response.data.message}`,
        }]
      };
    }
  }
);

server.tool(
  "hexschool_todolist_sign_in",
  "登入一個帳號，並取得 token",
  {
    email: z.string().email(),
    password: z.string(),
  },
  async (input) => {
    const { email, password } = input;
    try {
      const res = await axios.post(`${API_URL}/users/sign_in`, {
        email,
        password,
      });

      return {
        content: [{
          type: "text",
          text: `status: ${res.data.status}, exp: ${res.data.exp}, token: ${res.data.token}`,
        }]
      }
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `登入失敗，錯誤訊息: ${error.response.data.message}`,
        }]
      };
    }
  }
);

server.tool(
  'hexschool_todolist_checkout',
  '檢查 token 是否有效',
  {
    token: z.string(),
  },
  async (input) => {
    const { token } = input;
    try {
      const res = await axios.get(`${API_URL}/users/checkout`, {
        headers: {
          Authorization: token
        }
      });

      return {
        content: [{
          type: "text",
          text: `status: ${res.data.status}, uid: ${res.data.uid}`,
        }]
      }
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `檢查失敗，錯誤訊息: ${error.response.data.message}`,
        }]
      };
    }
  }
);

server.tool(
  'hexschool_todolist_sign_out',
  '登出帳號',
  {
    token: z.string(),
  },
  async (input) => {
    const { token } = input;
    try {
      const res = await axios.post(`${API_URL}/users/sign_out`, {}, {
        headers: {
          Authorization: token
        }
      });

      return {
        content: [{
          type: "text",
          text: `status: ${res.data.status}, message: ${res.data.message}`,
        }]
      }
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `登出失敗，錯誤訊息: ${error.response.data.message}`,
        }]
      };
    }
  }
);

server.tool(
  'hexschool_todolist_get_todos',
  '取得所有代辦事項',
  {
    token: z.string(),
  },
  async (input) => {
    const { token } = input;
    try {
      const res = await axios.get(`${API_URL}/todos`, {
        headers: {
          Authorization: token
        }
      });

      return {
        content: [{
          type: "text",
          text: `status: ${res.data.status}, data: ${JSON.stringify(res.data.data)}`,
        }]
      }
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `取得 Todo 失敗，錯誤訊息: ${error.response.data.message}`,
        }]
      };
    }
  }
)

server.tool(
  'hexschool_todolist_create_todo',
  '新增代辦事項',
  {
    token: z.string(),
    content: z.string(),
  },
  async (input) => {
    const { token, content } = input;
    try {
      const res = await axios.post(`${API_URL}/todos`, {
        content
      }, {
        headers: {
          Authorization: token
        }
      });

      return {
        content: [{
          type: "text",
          text: `status: ${res.data.status}, newTodo: ${JSON.stringify(res.data.newTodo)}`,
        }]
      }
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `新增 Todo 失敗，錯誤訊息: ${error.response.data.message}`,
        }]
      };
    }
  }
)

server.tool(
  'hexschool_todolist_update_todo',
  '更新代辦事項',
  {
    token: z.string(),
    todoId: z.string(),
    content: z.string(),
  },
  async (input) => {
    const { token, todoId, content } = input;
    try {
      const res = await axios.put(`${API_URL}/todos/${todoId}`, {
        content
      }, {
        headers: {
          Authorization: token
        }
      });

      return {
        content: [{
          type: "text",
          text: `status: ${res.data.status}, message: ${res.data.message}`,
        }]
      }
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `更新 Todo 失敗，錯誤訊息: ${error.response.data.message}`,
        }]
      };
    }
  }
)

server.tool(
  'hexschool_todolist_delete_todo',
  '刪除代辦事項',
  {
    token: z.string(),
    todoId: z.string(),
  },
  async (input) => {
    const { token, todoId } = input;
    try {
      const res = await axios.delete(`${API_URL}/todos/${todoId}`, {
        headers: {
          Authorization: token
        }
      });

      return {
        content: [{
          type: "text",
          text: `status: ${res.data.status}, message: ${res.data.message}`,
        }]
      }
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `刪除 Todo 失敗，錯誤訊息: ${error.response.data.message}`,
        }]
      };
    }
  }
);

server.tool(
  'hexschool_todolist_update_todo_status',
  '更新代辦事項狀態',
  {
    token: z.string(),
    todoId: z.string(),
  },
  async (input) => {
    const { token, todoId } = input;
    try {
      const res = await axios.patch(`${API_URL}/todos/${todoId}/toggle`, {}, {
        headers: {
          Authorization: token
        }
      });

      return {
        content: [{
          type: "text",
          text: `status: ${res.data.status}, message: ${res.data.message}`,
        }]
      }
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `更新 Todo 狀態失敗，錯誤訊息: ${error.response.data.message}`,
        }]
      };
    }
  }
);


async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("六角學院 TodoList MCP Server 啟動中...");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});