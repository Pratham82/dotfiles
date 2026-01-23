-- lua/config/vimtex.lua
return {
  "lervag/vimtex",
  ft = "tex", -- only load for .tex files
  config = function()
    -- Compiler setup
    vim.g.vimtex_compiler_method = "latexmk"
    vim.g.vimtex_compiler_latexmk = {
      build_dir = "", -- keep PDF in same folder
      options = {
        "-pdf",
        "-shell-escape",
        "-verbose",
        "-file-line-error",
        "-synctex=1",
        "-interaction=nonstopmode",
      },
    }

    -- PDF viewer (macOS Skim example)
    vim.g.vimtex_view_method = "skim"
    vim.g.vimtex_view_skim_sync = 1

    -- Optional: automatically populate quickfix on errors
    vim.g.vimtex_quickfix_mode = 1

    -- Optional: auto-build on save
    vim.cmd([[
      autocmd BufWritePost *.tex silent! VimtexCompile
    ]])
  end,
}
