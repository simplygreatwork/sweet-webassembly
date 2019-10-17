
- when handles are allocated, the pointers are stored in a multi-dimensional array
- the handles are stored in a multi-dimensional array - so that when memory is reclaimed - handles can be reclaimed as well
- 1 - 16 pointers uses an array of one dimension with length 16
- 17 - 256 pointers uses an array of two dimensions with length 16
- 257 - 4096 pointers uses an array of three dimensions with length 16
- when handle #17 is stored the single dimension array becomes handles[0]
- when handle #257 is stored the two dimension array becomes handles[0]
