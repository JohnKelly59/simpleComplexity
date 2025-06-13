

export const state = {
    questionMatrix: {},
    refreshCounts: {},
    lastRefreshTimes: {},
    tooltipsEnabled: true,
    tooltipRefGlobal: null,
    speedDialRef: null,
    temporaryTooltipRef: null,
    activeFetches: 0,
    speedDialEnabledGlobal: true
};

export function updateQuestionMatrix (newData)
{
    state.questionMatrix = { ...state.questionMatrix, ...newData };
}

export function getQuestion (key)
{
    return state.questionMatrix[key];
}

export function incrementRefreshCount (key)
{
    state.refreshCounts[key] = (state.refreshCounts[key] || 0) + 1;
}

export function getRefreshCount (key)
{
    return state.refreshCounts[key] || 0;
}

export function setLastRefreshTime (key, time)
{
    state.lastRefreshTimes[key] = time;
}

export function getLastRefreshTime (key)
{
    return state.lastRefreshTimes[key] || 0;
}

export function resetRefreshTracking ()
{
    state.refreshCounts = {};
    state.lastRefreshTimes = {};
}

export function setTooltipsEnabled (enabled)
{
    state.tooltipsEnabled = enabled;
}

export function setTooltipRef (ref)
{
    state.tooltipRefGlobal = ref;
}

export function setSpeedDialRef (ref)
{
    state.speedDialRef = ref;
}

export function setTemporaryTooltipRef (ref)
{
    state.temporaryTooltipRef = ref;
}

export function incrementActiveFetches ()
{
    state.activeFetches++;
}

export function decrementActiveFetches ()
{
    state.activeFetches--;
}