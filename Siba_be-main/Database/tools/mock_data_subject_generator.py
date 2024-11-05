"""
1. Copy this file to your folder
2. Choose amount of subjects in amount variable
3. Run file (python3 filename)
4. Use insert_subject.sql file in database
5. Use insert_allocsub.sql file in database
6. DONE!
"""

import random
import string
letters = string.ascii_lowercase
minutes = [15, 30, 45]
spaceTypes = [5002, 5004] #, 5004, 5004]
amount = 2000
allocRound = 10003
groupSizeRange = [1, 2]
groupCountRange = [1, 2]
areaRange = [5, 6]
programRange = [3001, 3030]
sessionCountRange = [1, 2]

# words = []
# with open('/usr/share/dict/words') as f:
#    for line in f:
#        words.append(line.strip())

try:
    subj=open('insert_subject.sql','w')
    subj.write("INSERT IGNORE INTO Subject(name, groupSize, groupCount, sessionLength, sessionCount, area, programId, spaceTypeId) VALUES \n")

    allocSub = open('insert_allocsub.sql', 'w')
    allocSub.write("INSERT IGNORE INTO AllocSubject(subjectId, allocRoundId) VALUES \n")

    for i in range (0, amount):
        name = '"' + ''.join(random.choice(letters) for i in range(15)) + '"'
        # name = f"\"{random.choice(words).capitalize()} {random.choice(words)} - TASO {random.randint(1,3)}\""
        subj.write(f"({name}, {random.randint(groupSizeRange[0],groupSizeRange[1])}, {random.randint(groupCountRange[0],groupCountRange[1])}, 0{random.randint(1,2)}{random.choice(minutes)}00, {random.randint(sessionCountRange[0],sessionCountRange[1])}, {random.randint(areaRange[0], areaRange[1])}, {random.randint(programRange[0], programRange[1])}, {random.choice(spaceTypes)})")
        allocSub.write(f"((SELECT id from Subject WHERE name={name}), {allocRound})")

        if i != amount -1:
            subj.write(', \n')
            allocSub.write(', \n')

    subj.close()
    allocSub.close()
except:
    print("ERROR!")
