- head
```wat

(module
	(import "utility.watm")
	(import "memory.watm")
	(import "number.watm")
	(import "host" "table" (table 1 anyfunc))
	(import "utility" "print_string" (func $print_string (param i32)))
	(import "utility" "print_integer" (func $print_integer (param i32)))
	(import "memory" "memory_allocate" (func $memory_allocate (param i32) (result i32)))
	(import "memory" "memory_copy" (func $memory_copy (param i32) (param i32) (param i32)))
	(import "number" "number_new" (func $number_new (param i32) (result i32)))
	(memory (import "host" "memory") 1)
	(type $i32_i32_to_void (func (param i32) (param i32)))
	
	(func $list_new (result i32)
		
		(local $list i32)
		(set_local $list (call $memory_allocate (i32.const 16)))
		(i32.store (i32.add (get_local $list) (i32.const 0)) (i32.const 10))			;; type
		(i32.store (i32.add (get_local $list) (i32.const 4)) (get_local $list))		;; next
		(i32.store (i32.add (get_local $list) (i32.const 8)) (get_local $list))		;; previous
		(i32.store (i32.add (get_local $list) (i32.const 12)) (i32.const 0))			;; length or item ref
		(get_local $list)
	)
	
	(func $list_dump (param $list i32)
		
		(call $print_integer (i32.load (i32.add (get_local $list) (i32.const 0))))
		(call $print_integer (i32.load (i32.add (get_local $list) (i32.const 4))))
		(call $print_integer (i32.load (i32.add (get_local $list) (i32.const 8))))
		(call $print_integer (i32.load (i32.add (get_local $list) (i32.const 12))))
	)
	
	(func $list_append (param $list i32) (param $data i32)
		
		(call $item_append (call $item_previous (get_local $list)) (get_local $data))
	)
	
	(func $list_length (param $list i32) (result i32)
		
		(local $result i32)
		(local $item i32)
		(set_local $result (i32.const 0))
		(set_local $item (get_local $list))
		(block (loop
			(set_local $item (i32.load (i32.add (get_local $item) (i32.const 4))))
			(br_if 1 (i32.eq (get_local $item) (get_local $list)))
			(set_local $result (i32.add (get_local $result) (i32.const 1)))
			(br 0)
		))
		(call $number_new (get_local $result))
	)
	
	(func $list_iterate (param $list i32) (param $function i32)
		
		(local $index i32)
		(local $item i32)
		(set_local $index (i32.const 0))
		(set_local $item (get_local $list))
		(block (loop
			(set_local $item (i32.load (i32.add (get_local $item) (i32.const 4))))
			(br_if 1 (i32.eq (get_local $item) (get_local $list)))
			(call_indirect (type $i32_i32_to_void)
				(get_local $item) (get_local $index)
				(get_local $function)
			)
			(set_local $index (i32.add (get_local $index) (i32.const 1)))
			(br 0)
		))
	)

	(func $list_to_string (param $list i32) (result i32)
		(i32.const 100)
	)
	
	(func $item_new (result i32)
		
		(local $item i32)
		(set_local $item (call $memory_allocate (i32.const 16)))
		(i32.store (i32.add (get_local $item) (i32.const 0)) (i32.const 10))			;; type
		(i32.store (i32.add (get_local $item) (i32.const 4)) (get_local $item))		;; next
		(i32.store (i32.add (get_local $item) (i32.const 8)) (get_local $item))		;; previous
		(i32.store (i32.add (get_local $item) (i32.const 12)) (i32.const 0))			;; length or item ref
		(get_local $item)
	)
	
	(func $item_dump (param $list i32)
		
		(call $print_integer (i32.load (i32.add (get_local $list) (i32.const 0))))
		(call $print_integer (i32.load (i32.add (get_local $list) (i32.const 4))))
		(call $print_integer (i32.load (i32.add (get_local $list) (i32.const 8))))
		(call $print_integer (i32.load (i32.add (get_local $list) (i32.const 12))))
	)

	(func $item_next (param $item i32) (result i32)
		(i32.load (i32.add (get_local $item) (i32.const 4)))
	)

	(func $item_previous (param $item i32) (result i32)		
		(i32.load (i32.add (get_local $item) (i32.const 8)))
	)

	(func $item_value (param $item i32) (result i32)		
		(i32.load (i32.add (get_local $item) (i32.const 12)))
	)

	(func $item_append (param $item i32) (param $data i32)
		
		(local $item_a i32)
		(local $item_b i32)
		(local $item_c i32)
		
		(set_local $item_a (get_local $item))
		(set_local $item_b (call $item_new))
		(set_local $item_c (call $item_next (get_local $item_a)))
		
		(i32.store (i32.add (get_local $item_a) (i32.const 4)) (get_local $item_b))
		(i32.store (i32.add (get_local $item_b) (i32.const 4)) (get_local $item_c))
		(i32.store (i32.add (get_local $item_b) (i32.const 8)) (get_local $item_a))
		(i32.store (i32.add (get_local $item_c) (i32.const 8)) (get_local $item_b))
		(i32.store (i32.add (get_local $item_b) (i32.const 12)) (get_local $data))
	)
	
	(export "list_new" (func $list_new))
	(export "list_length" (func $list_length))
	(export "list_append" (func $list_append))
	(export "list_iterate" (func $list_iterate))
	(export "list_to_string" (func $list_to_string))
	(export "item_new" (func $item_new))
	(export "item_next" (func $item_next))
	(export "item_previous" (func $item_previous))
	(export "item_value" (func $item_value))
	(export "item_append" (func $item_append))
)
```
