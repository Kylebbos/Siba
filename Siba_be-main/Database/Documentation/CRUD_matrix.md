```
C = Create, add
R = Read, list

U = Update
D = Delete
X = Execute procedure/trigger
? = Confirmation from Customer needed
```

|                          | Admin                | Planner(ownDep) | Plan.(in general) | Statist |
| :------------------------: | :--------------------: | :---------------: | :-----------------: | :-------: |
| AllocRound               | CRUD                 |                 | R                 | R       |
| Alloc\*(other tables)    | X (Only stored proc) |                 | R                 | R       |
| AllocRoundCurrentUser    | (Automatic?) R       |                 | R                 | R       |
| </br>                    |                      |                 |                   |         |
| Building                 | CRUD                 |                 | R                 | R       |
| Space ('Room')           | CRUD                 |                 | R ?               | R       |
| SpaceEquipment           | CRUD                 |                 | R ?               | R       |
| SpaceType                | CRUD                 |                 | R                 | R       |
| </br>                    |                      |                 |                   |         |
| Equipment                | CRUD                 |                 | CRUD              | R       |
| </br>                    |                      |                 |                   |         |
| Department               | CRUD                 | R               | R                 | R       |
| Program                  | CRUD                 | CRUD            | R                 | R       |
| Subject(Lesson, Session) | CRUD                 | CRUD            | R                 | R       |
| SubjectEquipment         | CRUD                 | CRUD            | R                 | R       |
| </br>                    |                      |                 |                   |         |
| User                     | CRUD                 |                 | R                 | R       |
| Department               | CRUD                 |                 | R                 | R       |
| </br>                    |                      |                 |                   |         |
| log_event                | (Automatic) R        |                 | R                 | R       |
| log_list                 | (Automatic) R        |                 | R                 | R       |
| log_type                 | (Automatic) R        |                 | R                 | R       |
| </br>                    |                      |                 |                   |         |
| GlobalSetting            | CRUD                 |                 | R                 | R       |
