module Main where

import Generate
import Test.QuickCheck

main :: IO ()
main = generate (arbitrary :: Gen Group) >>= putStrLn . show
