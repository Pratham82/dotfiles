#!/usr/bin/env bash


# Terminate already running bar instances
killall -q polybar
# If all your bars have ipc enabled, you can also use 
# polybar-msg cmd quit

# Launch bar1 and bar2
# echo "---" | tee -a /tmp/polybar1.log /tmp/polybar2.log
# polybar example >>/tmp/polybar1.log 2>&1 & disown



#if type "xrandr">/dev/null; then
#  echo "Lanching polybar for each screen"
#  xrandr --listactivemonitors | grep -oP '(HDMI\-\d+$|eDP\-\d+$)' | xargs -P1 -I{} bash -c "MONITOR={} polybar -q -r p00 &"
#fi1

#
#echo "Bars launched..."

#if type "xrandr"; then
#  for m in $(xrandr --query | grep " connected" | cut -d" " -f1); do
#    MONITOR=$m polybar --reload example &
#  done
#else
#  polybar --reload example &
#fi

# if type "xrandr"; then
#   for m in $(xrandr --query | grep " connected" | cut -d" " -f1); do
#     MONITOR=$m polybar --reload example &
#   done
# else
#   polybar --reload example &
# fi
for m in $(polybar --list-monitors | cut -d":" -f1); do
    MONITOR=$m polybar --reload example &
done
