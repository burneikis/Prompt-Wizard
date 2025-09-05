# Testing
Sent it to my mate lachlan for feedback.

## Notes
- heal spell, needs to be added (should be detected that the user wants to heal, and how much by)
- same spell as before (i think it pretends to have memory not sure tho)
- maybe add a spell history feature for the ai
- too random and lenient at times with numbers
- show (unmoderated) spell history to the left side
- add enter to submit spell, (shift enter shouldn't)
- you cant go back to past stages
- "dumb attack" was filtered

## Todo
- [x] Add heal spell detection (in the backend/prompting), if the user says something that sounds like a healing spell on themselves, use that during their turn
- [x] Add spell history log to the left side of the screen (only the spells that passed moderation)
- [x] Add enter to submit spell, (shift enter shouldn't)
- [ ] Allow going back to past stages after they complete (dont give points for replaying tho)


## More Todo
- [ ] investigate if the ai has memory of past turns, if not add history
- [ ] Investigate why "dumb attack" was filtered