# Brand assets

Drop the master logo here as `source-logo.png` (or `.svg`), then run:

    npm run brand

Everything else in this folder is generated — do not edit by hand.

Options:

    npm run brand -- --mode=lighten        # nothing drops out, flatter result
    npm run brand -- --mark-fraction=0.55  # tune where the wordmark starts

`--mode=invert` (the default) flips lightness: the dark drone and "LENS" become
light, the blues stay blue. Anything that was *light* in the source — the white
mountain fills — inverts to dark and survives only as its outline. Use
`--mode=lighten` if you would rather keep those and accept a flatter drone.
