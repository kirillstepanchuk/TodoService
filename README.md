# Менеджер задач

# Серверная часть для менеджера задач
Структуры данных и запросы, доступные для взаимодействия с сервером

## Структуры данных:
  - LocalTask:
  {
    "color": "yellow",
    "description": "find money for travel",
    "due_date": "2019-07-19T09:52:05.173Z",
    "is_archived": false,
    "is_favorite": false,
    "repeating_days": {
      "mo": false,
      "tu": false,
      "we": false,
      "th": false,
      "fr": false,
      "sa": false,
      "su": false
    }
  }
  - Task:
  {
    "id": "0",
    "color": "yellow",
    "description": "find money for travel",
    "due_date": "2019-07-19T09:52:05.173Z",
    "is_archived": false,
    "is_favorite": false,
    "repeating_days": {
      "mo": false,
      "tu": false,
      "we": false,
      "th": false,
      "fr": false,
      "sa": false,
      "su": false
    }
  }

## Запросы на задачи

### GET /tasks - Получение всех созданных задач.
  - Коды ответов: 200 ОK, 401 Unauthorized.
  - Пример:
  - Request:
  - URL: GET /tasks;
  - Headers: Authorization: Basic kTy9gIdsz2317rD.
  - Response:
  - Status: 200 OK;
  - Body: массив, содержащий элементы типа Task.
  - Request:
  - URL: GET /tasks.
  - Response:
  - Status: 401 Unauthorized;
  - Body: структура AuthorizationError.

### POST /tasks - Создание новой задачи.
  - Коды ответов: 200 ОК, 401 Unauthorized.
  - Пример:
  - Request
  - URL: POST /tasks;
  - Headers: Authorization: Basic kTy9gIdsz2317rD;
  - Body: структура LocalTask.
  - Response:
  - Status: 200 OK;
  - Body: структура Task.

### PUT /tasks/: id - Обновление существующей задачи.
  - Коды ответов: 200 ОК, 401 Unauthorized, 404 Not found.
  - Пример:
  - Request:
  - URL: POST /tasks/7;
  - Headers: Authorization: Basic kTy9gIdsz2317rD;
  - Body: структура данных вида Task.
  - Response:
  - Status: 200 OK;
  - Body: структура данных вида Task.

### DELETE /tasks/: id - Удаление существующей задачи.
  - Коды ответов: 200 ОК, 401 Unauthorized, 404 Not found.
  - Пример:
  - Request:
  - URL: DELETE /tasks/7;
  - Headers: Authorization: Basic kTy9gIdsz2317rD;
  - Response:
  - Status: 200 OK.

## Серверные ошибки
  - AuthorizationError:
  {
    "error": 401,
    "message": "Header Authorization is not correct"
  }
  - NotFoundError:
  {
    "error": 404,
    "message": "Not found"
  }
