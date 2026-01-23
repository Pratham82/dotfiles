function main()
	local wins = Window:list_visible(nil, true)

	if #wins ~= 3 then
		alert("Need exactly 3 visible windows")
		return
	end

	local screen = Screen.main()
	local sw = screen:width()
	local sh = screen:height()
	local sx = screen:x()
	local sy = screen:y()

	local positions = {
		{ x = sx, y = sy, w = sw * 0.5, h = sh },
		{ x = sx + sw * 0.5, y = sy, w = sw * 0.4, h = sh },
		{ x = sx + sw * 0.9, y = sy, w = sw * 0.1, h = sh },
	}

	for i, win in ipairs(wins) do
		win:set_frame(positions[i])
	end
end
