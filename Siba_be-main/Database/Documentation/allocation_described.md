# Allocation

Allocation is a process in which lessons/teaching sessions/(Opetukset) are distributed to spaces according to the specified criteria, which helps the users to plan the use of the spaces and equipment more efficiently.

The current allocation/calculation version has three different phases:
1. Prioritization of teachings (Opetukset)
- Processing of lessons one by one, in order of priority:
    - 2. We are looking for suitable space (room) for teaching
    - 3. Teaching is placed in the spaces.

---

## startAllocation procedure
The procedure is called when you want to start the calculation / allocation.
### Inspections
- The procedure has several checks to ensure functionality:
     - Allocation cannot be started or reset if the calculation is running with the same allocRound id.
     - Allocation cannot be restarted without resetting it first, i.e. clearing the results of the previous allocation.

### Important to know
- All allocation steps are called in this procedure.

---

## prioritizeSubjects
### Functionality
Adds priority numbers for lessons/teachings to the allocSubject table. In the next stages of the allocation, the lessons are processed in the order of priority number.
- The procedure currently has three different options for prioritization, which are called startAllocation at the beginning of the procedure.

### Important
- The prioritization settings are finalized and you should either agree on them in more detail with the customer or look at the development proposal below, in which case the customer could create them himself.

### Columns suitable for prioritization
- Equipment.priority (not recommended)
     - The priority number of the equipment is used as the default initial value of the equipment in the teaching mode, which is why SubjectEquipment.priority is the recommended option.
- Subject.groupSize
     - The number of students in the lesson, can be used when you want to allocate larger or smaller groups first.
     - Recommended option: smaller ones first to avoid wasting resources
- Subject.area
     - Space size required for teaching, can be used when you want to allocate larger or smaller spaces first.
     - Recommended option: smaller ones first to avoid wasting resources
- Subject.spaceType
     - Required space type (e.g. music class, lecture class)
     - In the current version, the order doesn't matter, but in the future version, maybe the lesson can be placed in more space types, in which case the recommended option might be to place all lessons first, whose primary option is not a lecture class.
- Subject.program (not recommended)
     - Teaching major/program
     - Difficult to put in a different order
- Subject.department (not recommended)
     - Teaching subject group
     - Difficult to put in a different order
- departmentplanner (not recommended)
     - Subject group designing person
     - Difficult to put in a different order
- Equipment.isMovable
     - Is there equipment in the lesson that cannot be moved.
- SubjectEquipment.priority (recommended)
     - The number value of the equipment priority needed by the lesson
     - *The most important criterion in allocation*
     - the allocation criteria can be, for example, that all lessons with equipment with a value greater than highPriority are to be processed first.
- SubjectEquipment.obligatory
     - Is the equipment mandatory for teaching?
     - Not used in the current version, because all equipment is mandatory for teaching.

### Development proposal (challengin, advanced)
- Prioritization could be rebuilt, so that different criteria/prioritization settings could be built into a separate view, in which case the main user could choose or create the desired prioritization sequences and criteria via Front. More precisely, there would be a view in the front, through which you could select the desired properties from the above columns and add their values.
     - For example, you could make a setting: SubjectEquipment.priority > 500 AND Subject.spaceType = "music classroom".
     - In the procedure, all the prioritization settings included in allocRound would be run through with a loop, in the order selected by the admin user.

---

## allocateSpace
The teaching is placed in suitable spaces or it is marked that it cannot be allocated.
- If there are no suitable spaces for the teaching, it is marked in the allocSubject table that it cannot be allocated.
- If there are spaces for teaching, the aim is to place the lessons so that the space is as close as possible to the teaching criteria.

### Functionality
- The aim is to first place the teaching in spaces where there is enough free space for all the lessons. If such a space is not found, we try to put as many teaching hours as possible in the same space.
- The lesson is always marked in a suitable space with the smallest maximum number of people in the space.
- The space must have the maximum number of people, square meters, type of space suitable for teaching, equipment must not be missing and the space must be in use.
- If no space is found with free time, all lessons are added to the space with the fewest reserved hours.
- If there is free time in suitable spaces for only some of the lessons, the rest will be added to the same space as the others.
- If there are no suitable spaces for teaching, it is indicated that it cannot be allocated

---

## resetAllocation
### Functionality
In the procedure, the allocation is reset, i.e. the results of the calculation are removed and the necessary values are changed back to the default state.

---

## setSuitableRooms
### Functionality
- Marks in the allocSubjectSuitableSpace table all spaces with square meters suitable for teaching, number of people, space type and the space must be in use
- How many pieces of equipment are missing from the space are marked on the board and the space is classified as suitable, although in the current version lessons are not placed in spaces that lack equipment. Because of this, the suitability of the room is also checked when teaching is placed in the space.

---

## abortAllocation
### Functionality

The procedure is used when you want to stop the allocation before it is finished.

### Important
- You need to add a button on the Front End side, rest Endpoint is already created and can be found at /api/allocation/abort

---
