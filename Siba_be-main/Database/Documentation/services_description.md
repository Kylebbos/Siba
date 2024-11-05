# Services
- They communicate with the database
- Return either JSON data or error message, if the call fails.
- Asynchronous, use Promises inside.

<details>
<summary>Allocation (calculation / allocRound)</summary>

| Fetch all calculations |   |
|---|---|
Method      | getAll
Parameters  | -
Returns     | All calculations
Contents    | id, name, isSeasonAlloc, description, lastModified

| Fetch a certain individual allocation round |   |
|---|---|
Method      | getById
Parameters  | allocRound.id
Returns     | Individual calculation/allocation round
Contents    | id, name, isSeason, description, lastModified, isAllocated, processOn, Subjects, allocated, unAllocated

| Fetch all subjects |   |
|---|---|
Method      | getAllSubjectsById
Parameters  | allocRound.id
Returns     | All subjects included in a calculation/allocation round
Contents    | subject.id, subject.name, allocSubject.isAllocated, allocSubject.cantAllocate, allocSubject.priority, allocatedHours, requiredHours
Note!       | Not in use anywhere yet (?)

| Fetch all spaces having teachings in a certain allocation round |   |
|---|---|
Method      | getRoomsByAllocId
Parameters  | allocRound.id
Returns     | all spaces having teachings in a certain allocation round
Contents    | id, name, allocatedHours, requiredHours, spaceTypeId

| Fetch all spaces in allocation, for a certain program |   |
|---|---|
Method      | getAllocatedRoomsByProgram
Parameters  | program.id, allocRound.id
Returns     | All spaces in allocation, for a certain program
Contents    | space.id, space.name, allocatedHours

| Fetch all allocation round subjects for a program |   |
|---|---|
Method      | getSubjectsByProgram
Parameters  | allocRound.id, program.id
Returns     | All subjects in allocation, for a certain program
Contents    | subject.id, subject.name, allocatedHours, requiredHours

| Start allocation |  |
|---|---|
Method      | startAllocation
Parameters  | allocRound (id)
Returns     | -
Contents    | Starts calculation/allocation round


| Reset allocation (=allocation round) |  |
|---|---|
Method      | resetAllocation
Parameters  | allocRound (id)
Returns     | -
Contents    | Resets the allocSubject, AllocSpace and AllocSubjectSuitableSpace tables

| Interrupt/stop the allocation process | |
|---|---|
Method      | abortAllocation
Parameters  | AllocRound.id
Returns     | -
Contents    | Tells the database to stop the running allocation process

| Fetch subjects, that could not be allocated | |
|---|---|
Method      | getUnAllocableSubjects
Parameters  | AllocRound.id
Returns     | subjects
Contents    | Returns unallocated subjects

| Fetch spaces for a certain Subject | |
|---|---|
Method      | getSpacesForSubject
Parameters  | Subject.id
Returns     | spaces
Contents    | Space.id, Space.name, Space.area, missingItems, areaOk, Space.personLimit, personLimitOk, Space.inUse, Space.spaceType, spaceTypeOk

| Fetch the missing equipment for certain space and certain subject | |
|---|---|
Method      | getMissingEquipmentForRoom
Parameters  | subject.id, space.id
Returns     | missing equipment for certain space and certain subject
Contents    | Equipment.id, Equipment.name, SpaceEquipment.name (Really this? Why this???)



</details>

<details>
<summary>Program (=Teaching)</summary>


| Fetch all Programs |   |
|---|---|
Method      | getAll
Parameters  | -
Returns     | All Programs
Contents    | id, name

| Fetch indivual/certain Program |   |
|---|---|
Method      | getById
Parameters  | id
Returns     | Individual Program
Contents    | id, name

</details>
