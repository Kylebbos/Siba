# Planning the allocation versioning

<details><summary>Data tables wanted for versioning. Done in phases.</summary>

First phase

* Subject - teaching. e.g. how many different kind of sessions per course will be offered
* SubjectEquipment - what kind of equipment we require for each kind of teaching/learning session

Second phase:

* SpaceEquipment - what is in each space
* Space - is space marked as available? taking more spaces into use. Modifying the spaceType for new purposes

</details>

<details><summary>Result tables wanted with versioning, if we want to keep the results</summary>

* all tables name starting with Alloc.
* all of them already have allocRoundId, even if it's called id (in AllocRound proper, like also should), allocId, allocRound x 3.
* They could be unified to id x 1, allocRoundId x 4

</details>

<details><summary>How to show the currently active alloc round?</summary>

Maybe at least the alloc round number shown in the top of the App bar on the left?

Later also the name, or start of the name?

</details>


<details><summary>What to copy/and how, when using old AllocRound as basis for a new AllocRound?</summary>

* The so far selected datatables' (see above) rows with old allocRoundId to the new allocRoundId.
* Phase by Phase. Only those copied that have been versioned.
* Making a POST AllocRound first (maybe a new end point), and if getting back the new allocRoundId successfully, copying then the corresponding old datarows in the selected datatables to the new allocRoundId too. Can be done in a database/SQL TRANSACTION and either COMMITted or ROLLBACKed.
* Not touching the old rows at all. They will stay for the original AllocRound. No affect to original AllocRound
* At least so far AllocRound table is WITHOUT any reference to the original AllocRound that it was created based on. And maybe good solution, as the original allocRound can be changed again with all of its details. Even possibly deleted?

</details>


<details><summary>Which View code (and their AJAX services) are affected by Versioning?</summary>

First phase (Subject and SubjectEquipment)

* SubjectList and possibly some of its sub views. At least while fetching data (subject lists) from database.
* Any uniqueness checks for the Subjects should now be compared to that allocRound only. E.g. uniqueness of the name will be true only for name && allocRoundId combo
* Possibly some Subject-related views might remain unaffected! As they are about one selected Subject and we don't want to change the allocRoundId
* Writing down all the changes (for doing the Second phase later easier=with the same knowledge).

Second phase (SpaceEquipement and Space)

* same as for First phase. Follow the same rules

</details>

<details><summary>Backend changes</summary>

* any uniqueness checks again needs to be fixed
* new endpoint for copying AllocRound to be a new AllocRound
* all endpoints for the changed datatables must be gone through
* foreign key changes? Subject.id is referred without allocRoundId now in SubjectEquipment only. Thus updating those in first phase (Subject, SubjectEquipment)

</details>

<details><summary>Allocation calculation stored procedure changes</summary>

* Bringing allocRoundId also to the source data selection.
* allocRoundId seems to be already in use in the calculation progress and calculation results. Check!

</details>
