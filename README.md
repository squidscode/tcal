An extension to help users quickly send calendar invites as human-readable text.

The extension reads through the static webpage at load time and replaces all text 
that looks like a `tcal invite` (i.e. of the form `` `Description @ Day Of Week 10:15 pm` ``)
and replaces it with a hyperlink that, when clicked, automatically downloads a calendar 
invite file with the given description at the specified time.
