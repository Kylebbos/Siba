# Rest-api endpoints

<details><summary>Allocation</summary>
Needed for different allocation versions/rounds.

| All allocations  |   |
|---|---|
Endpoint    | /api/allocation/
Method      | GET
Parameters  | -
Returns     | All allocRound table data.
Contents    | id, name, isAllocSeason, description, lastModified
Used in     | -

| Individual allocation |   |
|---|---|
Endpoint    | /api/allocation/:id
Method      | GET
Parameters  | allocRound.id
Returns     | Allocations from a certain allocation round.
Contents    | id, name, isAllocSeason, description, lastModified, isAllocated, processOn, Subjects, allocated, unAllocated
Used in     | -

| Spaces based on allocation round |   |
|---|---|
Endpoint    | /api/allocation/:id/rooms
Method      | GET
Parameters  | allocRound.id
Returns     | Spaces based on allocation round
Contents    | space.id, space.name, allocatedHours, requiredHours, spaceTypeId
Used in     | Results view

| Allocation round contents organized by programs |   |
|---|---|
Endpoint    | /api/allocation/:id/program/
Method      | GET
Parameters  | allocRound.id
Returns     | All programs and their contents
Contents    | program.id, program.name, rooms(id, name, allocatedHours), subjects(id, name, allocatedHours, requiredHours)
Used in     | Results view


| Starting the allocation |   |
|---|---|
Endpoint    | /api/allocation/start
Method      | POST
Parameters  | AllocRound.id
Returns     | -
Contents    | -
Used in     | Results view

| Resetting the allocation |   |
|---|---|
Endpoint    | /api/allocation/reset
Method      | POST
Parameters  | AllocRound.id
Returns     | For a certain allocation round: Removes the course from the AllocSpace table and resets isAllocated, priority ja cantAllocate, in allocSubject table.
Contents    | -
Used in     | Results view

| Interrupting the allocation process |   |
| --- | ---|
Endpoint    | /api/allocation/abort
Method      | POST
Parameters  | AllocRound.id
Returns     | -
Contents    | -
Used in     | -

| Unallocated subjects (teachings) |   |
| --- | ---|
Endpoint    | /api/allocation/:id/subject/unallocated
Method      | GET
Parameters  | AllocRound.id
Returns     | All allocationRound subjects, that could not be allocated to the spaces
Contents    | subjectId, subject.name, subject.groupSize, subject.area, subject.spaceType
Used in     | AllocationSubjectFailureView

| Suitability of spaces for a certain Subject |   |
| --- | ---|
Endpoint    | /api/allocation/subject/:subjectId/rooms
Method      | GET
Parameters  | subject.id
Returns     | Suitability of spaces for a certain Subject
Contents    | space.id, space.name, space.area, missingItems, areaOk, space.personLimit, personLimitOk, space.inUse, space.spaceType, spaceTypeOk
Used in     | AllocationSubjectFailureView

| Missing equipment in a certain space for a certain subject |   |
| --- | ---|
Endpoint    | /api/allocation/missing-eqpt/subject/:subid/room/:roomid
Method      | GET
Parameters  | subject.id, space.id
Returns     | Missing equipment in a certain space for a certain subject
Contents    | equipment.id, equipment.name
Used in     | AllocationFailureView


</details>

<details><summary>Program</summary>

| Program id:s and name:s |    |
|---|---|
Endpoint    | /api/program/getNames
Method      | GET
Parameters  | -
Returns     | All Programs list
Contents    | program.id, program.name

</details>

<details><summary>SpaceType</summary>

| All space types |   |
|---|---|
Endpoint    | /api/spaceType/getNames
Method      | GET
Parameters  | -
Returns     | All spacetypes
Contents    | id, name

</details>

<details><summary>Subject (Teaching)</summary>

| All Subjects |   |
|---|---|
Endpoint    | /api/subject/getAll
Method      | GET
Parameters  | -
Returns     | All Subjects
Contents    | id, name, groupSize, groupCount, sessionLength, sessionCount, area, program.id, program.name, spaceTypeId, spaceTypeName

| Add new Subject |   |
|---|---|
Endpoint    | /api/subject/post
Method      | POST
Parameters  | name, groupSize, groupCount, sessionLength, sessionCount, area, programId, spaceTypeId
Returns     | Adds new Subject, (returns the id of the added subject?)
Contents    | -

| Removing a subject |   |
|---|---|
Endpoint    | /api/subject/delete/:id
Method      | DELETE
Parameters  | subject.id
Returns     | Removes the subject, (returns code 200?)
Contents    | -

| Modifying the Subject |   |
|---|---|
Endpoint    | /api/subject/update
Method      | PUT
Parameters  | id, name, groupSize, groupCount, sessionLength, sessionCount, area, programId, spaceTypeId
Returns     | Updates the Program, (returns code 200?)
Contents    | -
</details>
