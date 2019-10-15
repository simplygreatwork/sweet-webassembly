

note: also need to be able to reuse handle ids
keep a pool of expired handle ids
	maybe tree would be good for this
	can just attach expired node to another tree
	and can then just walk to get the next

pointer counter stored at address 0-3
handles object found at address 4
	counter_pointer (address 0)
	counter_handle (address 4)
	array (address 8)
		type (address 8)
		length (address 12)
		item (address 16) value = (address 8)


handles are stored in a multi-dimensional array
with 256 handles or less

handles
- type (typeof "handles")
- counter (level can be calulated from handles count)
- array (top level array)
	- type
	- length

each array needs type and a length

how to know whether an item at an index is a pointer or an array?
answer: items at the lowest level are always pointers
but need to know (record) how many levels are active

if <= 256 one level is active
if <= 65355 two levels are active

condensed arrays will only use one additional byte per entry

byte then 4 byte pointer

what if 

array
- type
- length
- items