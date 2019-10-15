
- possible to have data structures work using both handles and/or pointers?
- because if handle arrays use handles themselves - will have recursion

- can handles manage handle arrays? 

if I allocate one handle array - it's only going to add a single handle item into an existing array
- the chance of creating a new handle array is onlu 1 out of 256
- so I can use handle based arrays for handle arrays

- arrays need to 

- need a top level object - because the top level handle array may change

- idea: implement handle/pointer lookup using array ^ 4
- have a single array which contains pointers to regular objects
	- else pointers to handle arrays
	- so never have to walk a list - can just delve into subarrays depending on the type

will use multi-dimensional arrays instead of list or tree

when 256 * 256 fills up the array becomes 256 * 256 * 256
filling the new slot of 
if an item at the index is null (0) there are no elements within that range

maybe at a certain threshold when the contents of 256 array is very sparse
	then use a binary search tree instead to store less than (perhaps) 64 - 128 values
	or just switch to simple list of pairs within an array - odd is ID - even is pointer

start with single level (multi-dimensional)
the progress to level 2
up to level 4

- need a pointer counter
- need a handle counter
- couldn't this approach be potentially recursive?
- solution: if I use a tree to store handles - don't use handles - use pointers
- because I know that there is a single pointer pointing to each tree node
- if I use vector - don't use handles

- every object needs functions to return 1. type and 2. size

- need to be able to look at a type and know the length
- pass a pointer and return the length - string size will be calculated

- the most important task for compaction to to free each upper most memory page for release
- otherwise, per memory page or "zone"
	- data is allocated left aligned in a page
	- pointer handles are allocated right aligned in a page
- idea: maybe only record deltas/offsets only if a structure has been moved

- pointer handle list is basically just like an array
- pointer and length

- double pointer tables first 4 bytes is length of the double pointer tables

- how to use a facade for pointers - regardless of whether a double pointer or raw pointer

- if an id is larger than what's in the first page then look in the second page

- issue: if table data is stored in a high page - will those lookups need to be moved down
- if I store them allocated

- start with a section which describes where the double pointer lookup table is located - in case it is among multiple pages