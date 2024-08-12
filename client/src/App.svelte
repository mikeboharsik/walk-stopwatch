<script>
  import { getClockText } from './util/getClockText';
  import { getDisplayText } from './util/getDisplayText';
  import { getInitialState } from './util/getInitialState';
  import { EVENT_TYPE, markButtons } from './util/markButtons';
  import { updateStorage } from './util/updateStorage';
  import { handleResetClick } from './util/handleResetClick';
  import { handleUploadClick } from './util/handleUploadClick';
  import { handleDownloadClick } from './util/handleDownloadClick';
  import { handleToggleClick } from './util/handleToggleClick';
  import { getInputChangeHandler } from './util/getInputChangeHandler';
  import { getInputBlurHandler } from './util/getInputBlurHandler';
  import { getItemDeleteHandler } from './util/getItemDeleteHandler';
  import { getAddMarkHandler } from './util/getAddMarkHandler';
  import { getItemStyle } from './util/getItemStyle';

  let uploadHost = localStorage.getItem('uploadHost');
  if (!uploadHost) {
    localStorage.setItem('uploadHost', 'https://mike-desktop.local');
    uploadHost = 'https://mike-desktop.local';
  }

  let lastTimestamp = parseInt(localStorage.getItem('lastTimestamp') ?? new Date().getTime());

  let state = getInitialState();
  if (state.running) { state.elapsed += (new Date().getTime() - lastTimestamp); }

  let clockText = getClockText();
  let stopwatchText = getDisplayText(state.elapsed);
  let isUploading = false;
  let uploadStatusEndTime = 0;
  let lastUploadStatus = null;
  let curTime = new Date().getTime();
  let isRunning = false;
  let clockClickCount = 0;
  let timerClickCount = 0;
  let isTestUpload = false;
  let lastMsSinceInit = 0;

  function setUploadStatus(message, seconds) {
    const d = new Date();
    d.setSeconds(d.getSeconds() + 3);
    uploadStatusEndTime = d.getTime();
    lastUploadStatus = message;
  }

  let clockTimeout = null;
  function handleClockClick() {
    clockClickCount += 1;

    if (clockClickCount === 1) {
      clockTimeout = setTimeout(() => clockClickCount = 0, 5000);
    }

    if (clockClickCount >= 5) {
      clearTimeout(clockTimeout);
      clockClickCount = 0;

      const newUploadHost = prompt('Enter new upload host');
      if (newUploadHost) {
        localStorage.setItem('uploadHost', newUploadHost);
        uploadHost = newUploadHost;
      }
    }
  }

  let timerTimeout = null;
  function handleTimerClick() {
    timerClickCount += 1;

    if (timerClickCount === 1) {
      timerTimeout = setTimeout(() => timerClickCount = 0, 5000);
    }

    if (timerClickCount >= 5) {
      clearTimeout(timerTimeout);
      timerClickCount = 0;

      document.querySelector('#gps_file_download').click();
    }
  }

  function update(msSinceInit) {
    if (state.running) {
      const dt = msSinceInit - lastMsSinceInit;

      state.elapsed += dt;
    }

    lastMsSinceInit = msSinceInit;
    lastTimestamp = new Date().getTime();

    clockText = getClockText();
    stopwatchText = getDisplayText(state.elapsed);
    curTime = new Date().getTime();
    isRunning = state.running;

    updateStorage(state, lastTimestamp);
    requestAnimationFrame(update);
  }

  update(0);
</script>

<main>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <h1 style={'user-select: none'} on:click={handleClockClick}>{clockText}</h1>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <h1 style={'user-select: none'} on:click={handleTimerClick}>{stopwatchText}</h1>
  {#if curTime < uploadStatusEndTime}
    <h1>{lastUploadStatus}</h1>
  {/if}

  <p>
    <button on:click={() => handleToggleClick(state, lastTimestamp)}>Toggle</button>
    <button on:click={e => { isTestUpload = e.ctrlKey; document.querySelector('#gps_file').click(); }} disabled={!state.marks.length || isUploading}>Upload</button>
    {#if !isRunning}
      <button on:click={() => { handleResetClick(state, lastTimestamp); state = state; }}>Reset</button>
    {/if}
  </p>
  <p>
    {#if state.marks.find(m => m.type === EVENT_TYPE.BEGIN)}
      {''}
    {:else}
      <button on:click={() => getAddMarkHandler({ type: EVENT_TYPE.BEGIN })(state)} disabled={!state.running}>START</button>
    {/if}

    {#if (!state.marks.find(m => m.type === EVENT_TYPE.BEGIN) || state.marks.find(m => m.type === EVENT_TYPE.END))}
      {''}
    {:else}
      <button on:click={() => getAddMarkHandler({ type: EVENT_TYPE.END })(state)} disabled={!state.running}>END</button>
    {/if}
  </p>
  <p>
    {#each markButtons as markButton}
      <button on:click={() => getAddMarkHandler(markButton)(state)} disabled={!state.running}>{markButton.label}</button>
    {/each}
  </p>

  <ol reversed style={'text-align: left; font-size: 16px;'}>
    {#each state.marks.toReversed() as mark, idx}
      {@const itemStyle = getItemStyle(state, mark, idx)}
      {@const inputChangeHandler = getInputChangeHandler(mark.id)}
      {@const inputBlurHandler = getInputBlurHandler(mark.id)}
      {@const itemDeleteHandler = getItemDeleteHandler(mark.id)}
      <li style={itemStyle}>
        {getDisplayText(mark.mark)}
        -
        {#if mark.type === EVENT_TYPE.BEGIN}
          BEGIN
        {:else if mark.type === EVENT_TYPE.END}
          END
        {:else if mark.type === EVENT_TYPE.PLATE}
          PLATE <input type="text" style={'width: 122px'} id={`input_${mark.id}`} value={mark.plate} on:blur={(e) => inputBlurHandler(e, state)} on:input={(e) => inputChangeHandler(e, state, lastTimestamp)}/>
        {:else if mark.type === EVENT_TYPE.PLATE_MA}
          MA <input type="text" style={'width: 122px'} id={`input_${mark.id}`} value={mark.plate} on:blur={(e) => inputBlurHandler(e, state)} on:input={(e) => inputChangeHandler(e, state, lastTimestamp)}/>
        {:else if mark.type === EVENT_TYPE.PLATE_ME}
          ME <input type="text" style={'width: 122px'} id={`input_${mark.id}`} value={mark.plate} on:blur={(e) => inputBlurHandler(e, state)} on:input={(e) => inputChangeHandler(e, state, lastTimestamp)}/>
        {:else if mark.type === EVENT_TYPE.PLATE_NH}
          NH <input type="text" style={'width: 122px'} id={`input_${mark.id}`} value={mark.plate} on:blur={(e) => inputBlurHandler(e, state)} on:input={(e) => inputChangeHandler(e, state, lastTimestamp)}/>
        {:else if mark.type === EVENT_TYPE.TAG}
          TAG <input type="text" style={'width: 122px'} id={`input_${mark.id}`} value={mark.tag} on:blur={(e) => inputBlurHandler(e, state)} on:input={(e) => inputChangeHandler(e, state, lastTimestamp)}/>
        {:else}
          <input type="text" id={`input_${mark.id}`} value={mark.name} on:blur={(e) => inputBlurHandler(e, state)} on:input={(e) => inputChangeHandler(e, state, lastTimestamp)}/>
        {/if}

        {#if itemStyle}
          <button style={'vertical-align: middle; margin: 0; padding: 0; height: 28px; width: 32px'} on:click={() => itemDeleteHandler(state)}>X</button>
        {/if}
      </li>
    {/each}
  </ol>

  <input style="display: none" type="file" id="gps_file" on:change={(e) => handleUploadClick(
    e,
    state,
    uploadHost,
    () => { isUploading = true; setUploadStatus('Upload started', 3) },
    () => setUploadStatus('Success', 3),
    () => setUploadStatus('Failure', 3),
    () => isUploading = false,
    isTestUpload)}>
  <input style="display: none" type="file" id="gps_file_download" on:change={(e) => handleDownloadClick(e, state)}>
</main>

<style>
</style>
