# F1 Buddy [F1 Bot]

## Created By :
[@rakib-shahid](https://github.com/rakib-shahid) & [@jubuyer](https://github.com/jubuyer)

## Deployment
Made for Discord, hosted on Heroku

### To-Do
- [ ] fix quali command, calling round number > last round causes bot to break
- [ ] align wdc and wcc commands
- [ ] embed wdc and wcc commands
- [ ] binary search for driver?



### FIXED
### Quali command is currently broken in this branch

- [x] Calling quali command >1 times breaks the bot
- [x] Clean up quali command & refactor into new methods

Possible solution

- [x] Create 3 embeds at quali call, swap between with buttons


### Previous To-Do List
- [x] (kind of fixed) Figure out timezones for next command

- [x] Migrate Typescript build of F1 Buddy to strictly Javascript
    * [x] Add settings file to import/change prefix character
    * [x] Add command checks to ensure they are valid (fix things like "$n$driver 1")
    * [x] Add pics
    * [x] Add discord emojis to commands

- [x] Fix string error when calling next event
- [x] Add date objects for next event
- [x] Remove local calendar (use [*this*](https://www.formula1.com/calendar/Formula_1_Official_Calendar.ics))
- [x] Fix stat fetch
- [x] Add documentation
- [x] Fetch F1 data from ergast API
- [x] Fix change prefix command (catch invalid prefixes)
