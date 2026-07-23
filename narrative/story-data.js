/* ============================================================
   Story Data - 三條角色線的完整劇情資料
   ============================================================ */
window.Game = window.Game || {};

Game.StoryData = {

  /* ========================================
     航管員 (ATC) 故事線
     基於 Boston Center 真實事件改編
     ======================================== */
  atc: {
    role: '航管員',
    roleEn: 'Air Traffic Controller',
    location: 'Boston Center 航管中心',
    startTime: '08:00',
    nodes: {
      'atc_start': {
        id: 'atc_start',
        speaker: '旁白',
        text: '2001年9月11日，早上八點。你是波士頓航管中心（Boston Center）的值班管制員。今天是個晴朗的早晨，雷達螢幕上數十個光點井然有序地移動著。這是再平常不過的一天——至少目前看來是這樣。',
        timestamp: '08:00 AM',
        mood: 'calm',
        choices: [
          { text: '檢查今天的航班清單', nextId: 'atc_checklist' },
          { text: '與同事交接班報', nextId: 'atc_checklist' }
        ]
      },
      'atc_checklist': {
        id: 'atc_checklist',
        speaker: '旁白',
        text: '你的螢幕上追蹤著多架航班。其中包括美國航空11號班機（AA11）——一架波音767，從波士頓飛往洛杉磯，載有81名乘客及11名機組人員。一切看起來正常。航班正在依照既定航路爬升至巡航高度。',
        timestamp: '08:13 AM',
        mood: 'calm',
        historicalNote: 'AA11 於 08:00 從波士頓洛根機場起飛，原定飛往洛杉磯。機上有92人。',
        next: 'atc_routine'
      },
      'atc_routine': {
        id: 'atc_routine',
        speaker: '你（航管員）',
        text: '「美國航空一一，波士頓管制，請爬升並保持飛行高度三五零。」\n\n你發出了例行指令，等待回覆。通常機長會在幾秒內回應。',
        timestamp: '08:13 AM',
        mood: 'calm',
        next: 'atc_no_response'
      },
      'atc_no_response': {
        id: 'atc_no_response',
        speaker: '旁白',
        text: '沒有回應。\n\n你皺了皺眉，再看了看雷達——AA11的光點還在，但沒有照指令爬升。你再次嘗試呼叫。',
        timestamp: '08:14 AM',
        mood: 'tense',
        next: 'atc_second_call'
      },
      'atc_second_call': {
        id: 'atc_second_call',
        speaker: '你（航管員）',
        text: '「美國航空一一，波士頓管制，你收到了嗎？請回覆。」\n\n……依然沒有回應。你注意到AA11開始偏離預定航路。',
        timestamp: '08:14 AM',
        mood: 'tense',
        historicalNote: '實際事件中，航管員 Peter Zalewski 在 08:14 開始注意到 AA11 不回應指令。這是最早的異常信號之一。',
        choices: [
          { text: '嘗試在其他頻率呼叫', nextId: 'atc_other_freq', consequence: 'thorough' },
          { text: '立即通報主管', nextId: 'atc_notify_sup', consequence: 'proactive' },
          { text: '繼續嘗試原頻率', nextId: 'atc_keep_trying', consequence: 'cautious' }
        ]
      },
      'atc_other_freq': {
        id: 'atc_other_freq',
        speaker: '旁白',
        text: '你切換到緊急頻率 121.5 MHz 嘗試呼叫。\n\n「美國航空一一，這裡是波士頓管制，任何聽到本通訊的航班請回報。」\n\n仍然沒有回應。但就在此時——你的耳機裡傳來一段令人不安的聲音。',
        timestamp: '08:24 AM',
        mood: 'tense',
        next: 'atc_strange_transmission'
      },
      'atc_notify_sup': {
        id: 'atc_notify_sup',
        speaker: '旁白',
        text: '你轉頭叫來主管：「長官，AA11 沒有回應任何通訊，而且正在偏離航路。」\n\n主管走過來查看你的螢幕。他皺起眉頭。\n\n就在此時——你的耳機裡傳來一段令人不安的聲音。',
        timestamp: '08:21 AM',
        mood: 'tense',
        next: 'atc_strange_transmission'
      },
      'atc_keep_trying': {
        id: 'atc_keep_trying',
        speaker: '旁白',
        text: '你繼續在原頻率呼叫，一次又一次。每次呼叫之間，你都仔細聆聽是否有任何回音。AA11 的光點持續偏離航路。\n\n然後——你的耳機裡傳來一段令人不安的聲音。',
        timestamp: '08:24 AM',
        mood: 'tense',
        next: 'atc_strange_transmission'
      },
      'atc_strange_transmission': {
        id: 'atc_strange_transmission',
        speaker: '無線電（未知聲音）',
        text: '「我們有飛機了。安靜，就不會有人受傷。回到座位上。」\n\n你的血液瞬間冰冷。這不是機長的聲音。你聽到的是——劫機者意外開啟了對外通訊。',
        timestamp: '08:24 AM',
        mood: 'critical',
        historicalNote: '這段通訊是真實發生的。劫機者 Mohamed Atta 誤將機內廣播按成了對外通訊頻率，讓航管員聽到了駕駛艙內的情況。這是第一個明確的劫機證據。',
        choices: [
          { text: '立即通報 FAA 總部和軍方', nextId: 'atc_alert_military', consequence: 'decisive' },
          { text: '確認通訊來源，嘗試與機長聯繫', nextId: 'atc_confirm_source', consequence: 'cautious' },
          { text: '通知所有相關部門——這是劫機事件', nextId: 'atc_full_alert', consequence: 'proactive' }
        ]
      },
      'atc_alert_military': {
        id: 'atc_alert_military',
        speaker: '旁白',
        text: '你的手在顫抖，但你快速撥通了 NORAD（北美防空司令部）的聯繫電話。\n\n「這裡是波士頓管制中心，我們確認美國航空11號班機遭到劫持。飛機已脫離預定航路，無法與機組人員建立通訊。」\n\n電話那頭沉默了一秒——然後開始了一連串緊急調度。',
        timestamp: '08:34 AM',
        mood: 'critical',
        historicalNote: '在實際事件中，NORAD 的 NEADS 直到 08:40 才接到正式通知。軍方戰鬥機從奧的斯空軍基地緊急起飛，但為時已晚。',
        next: 'atc_transponder_off'
      },
      'atc_confirm_source': {
        id: 'atc_confirm_source',
        speaker: '旁白',
        text: '你嘗試回覆：「通訊來源不明的航機，這裡是波士頓管制，請確認身份。」\n\n沒有回應。\n\n你再次聽到雜音——是尖叫聲，和不明語言。你的同事們開始圍過來查看。主管已經開始撥打上級電話。',
        timestamp: '08:28 AM',
        mood: 'critical',
        next: 'atc_transponder_off'
      },
      'atc_full_alert': {
        id: 'atc_full_alert',
        speaker: '你（航管員）',
        text: '「所有人注意！AA11 疑似遭到劫持！我需要人聯繫 FAA 總部、通知 NORAD、並追蹤該航班所有雷達資料！」\n\n管制室裡瞬間忙碌起來。你的同事們開始分頭行動。你回到螢幕前——然後發現了更糟的事。',
        timestamp: '08:25 AM',
        mood: 'critical',
        next: 'atc_transponder_off'
      },
      'atc_transponder_off': {
        id: 'atc_transponder_off',
        speaker: '旁白',
        text: 'AA11 的應答機信號突然消失了。\n\n你的雷達螢幕上，原本清晰標示著航班資訊的光點——現在只剩下一個微弱的初級雷達回波。沒有高度、沒有速度、沒有航班識別。你只能靠最原始的雷達訊號推斷它的位置。\n\n飛機正在快速降低高度，朝紐約方向飛去。',
        timestamp: '08:21 AM',
        mood: 'critical',
        historicalNote: 'AA11 的應答機在 08:21 被關閉。對航管員來說，這意味著失去了大部分追蹤能力。他們只能依靠初級雷達（一般雷達回波）大致判斷飛機位置。',
        choices: [
          { text: '用初級雷達全力追蹤', nextId: 'atc_track_primary', consequence: 'focused' },
          { text: '請求周圍航班幫忙目視確認', nextId: 'atc_ask_visual', consequence: 'resourceful' }
        ]
      },
      'atc_track_primary': {
        id: 'atc_track_primary',
        speaker: '旁白',
        text: '你死死盯著雷達螢幕，在密密麻麻的回波中試圖辨識 AA11 的微弱光點。它在持續下降——從35,000英呎降到了20,000……15,000……10,000……\n\n速度極快。飛機在加速。\n\n你在心中清楚地知道——這架飛機不打算降落在任何機場。',
        timestamp: '08:40 AM',
        mood: 'critical',
        next: 'atc_second_plane'
      },
      'atc_ask_visual': {
        id: 'atc_ask_visual',
        speaker: '旁白',
        text: '你呼叫附近的航班：「在AA11附近的航機，有人能目視確認一架波音767嗎？低高度，高速飛行。」\n\n一架商用機回報：「波士頓管制，我看到一架大型噴射機在非常低的高度高速飛行，方向朝南……朝紐約方向。」\n\n你的心沉了下去。',
        timestamp: '08:38 AM',
        mood: 'critical',
        next: 'atc_second_plane'
      },
      'atc_second_plane': {
        id: 'atc_second_plane',
        speaker: '旁白',
        text: '08:46 AM——AA11 的光點在雷達上消失了，最後位置在曼哈頓上空。\n\n你的手停在控制台上。幾秒後，新聞頻道傳來消息：世貿中心北塔被一架飛機撞擊。\n\n但你沒有時間悲傷。因為在你的螢幕上——另一架飛機開始偏離航路。\n\n聯合航空175號班機（UA175），同樣是波士頓出發飛往洛杉磯的波音767。它停止回應通訊了。',
        timestamp: '08:46 AM',
        mood: 'critical',
        historicalNote: 'AA11 於 08:46:40 撞擊世貿中心北塔（WTC 1）。幾乎在同一時間，航管員開始注意到 UA175 也出現異常。UA175 上有65人。',
        choices: [
          { text: '立即下令：關閉整個紐約空域', nextId: 'atc_close_airspace', consequence: 'decisive' },
          { text: '將所有可用資源轉向追蹤 UA175', nextId: 'atc_track_ua175', consequence: 'focused' }
        ]
      },
      'atc_close_airspace': {
        id: 'atc_close_airspace',
        speaker: '旁白',
        text: '你向主管建議立即關閉紐約地區空域。在這混亂的時刻，你的果斷讓指揮鏈迅速反應。\n\n但你從螢幕上看到——UA175 正急轉彎，朝曼哈頓方向飛去。\n\n09:03 AM——第二聲撞擊。\n\n管制室裡一片死寂。每個人都知道了——這不是意外，這是攻擊。',
        timestamp: '09:03 AM',
        mood: 'critical',
        historicalNote: 'UA175 於 09:03:11 撞擊世貿中心南塔（WTC 2）。這一刻全世界確認了這是一場有組織的恐怖攻擊。',
        next: 'atc_groundstop'
      },
      'atc_track_ua175': {
        id: 'atc_track_ua175',
        speaker: '旁白',
        text: '你試圖追蹤 UA175，但它的應答機也被關閉了。你在螢幕上看到一個光點急速轉向——直奔曼哈頓。\n\n09:03 AM——你親眼在雷達上看著那個光點撞上世貿中心南塔的位置，然後消失。\n\n管制室裡有人開始哭泣。你咬緊牙關——因為你不確定還有沒有其他飛機。',
        timestamp: '09:03 AM',
        mood: 'critical',
        historicalNote: 'UA175 撞擊南塔時，全球電視正在直播北塔的火災畫面，數百萬人親眼目睹了撞擊瞬間。',
        next: 'atc_groundstop'
      },
      'atc_groundstop': {
        id: 'atc_groundstop',
        speaker: '旁白',
        text: 'FAA 國家行動中心正在討論一項前所未有的決定。\n\n你的通訊頻道傳來指令：全國地面停飛令（National Ground Stop）。美國領空內所有民航飛機必須立即就近降落。這是美國航空史上第一次——全面關閉領空。\n\n你需要引導你管轄範圍內的所有航班安全降落。螢幕上有數十架飛機需要你的指引。',
        timestamp: '09:45 AM',
        mood: 'tense',
        historicalNote: 'FAA 國家行動經理 Ben Sliney 在 09:45 下令全美地面停飛。這是他上任的第一天。航管員們在接下來的數小時內引導了約4,500架飛機安全降落——這被認為是航空史上最偉大的成就之一。',
        choices: [
          { text: '冷靜而堅定地引導每架航班降落', nextId: 'atc_guide_down', consequence: 'heroic' },
          { text: '優先處理離紐約最近的航班', nextId: 'atc_guide_down', consequence: 'strategic' }
        ]
      },
      'atc_guide_down': {
        id: 'atc_guide_down',
        speaker: '旁白',
        text: '在接下來的兩個小時裡，你和全美國的航管員一起，完成了一項不可能的任務。\n\n4,546架飛機。全部安全降落。零事故。\n\n你的聲音沙啞了，手指因為長時間緊握而僵硬。但每一架飛機安全落地的確認回報，都是今天這場噩夢中唯一的亮光。\n\n當最後一架飛機降落後，你摘下耳機，看著空蕩蕩的雷達螢幕。美國的天空從未如此安靜過。',
        timestamp: '12:15 PM',
        mood: 'solemn',
        historicalNote: '全美停飛令的執行被視為航管系統的最高成就。航管員們承受了巨大的壓力，許多人在事後都出現了創傷後壓力症候群（PTSD）。他們是那天不被看見的英雄。',
        next: 'atc_end'
      },
      'atc_end': {
        id: 'atc_end',
        speaker: '旁白',
        text: '那天，你在崗位上待了超過12個小時。\n\n當你終於走出管制中心，仰望天空——沒有飛機。空無一物。只有風聲。\n\n你知道，這片天空再也不會跟以前一樣了。而你，作為那天在幕後守護安全的人，將永遠記得每一個消失在雷達上的光點代表著什麼。',
        timestamp: '',
        mood: 'solemn',
        isEnd: true,
        endTitle: '無聲的守護者',
        endDesc: '你體驗了航管員在 911 事件中的視角。他們在混亂中保持冷靜，引導了 4,546 架飛機安全降落——這是他們的英雄故事。'
      }
    },
    nodeOrder: ['atc_start', 'atc_checklist', 'atc_routine', 'atc_no_response', 'atc_second_call', 'atc_strange_transmission', 'atc_transponder_off', 'atc_second_plane', 'atc_groundstop', 'atc_guide_down', 'atc_end']
  },

  /* ========================================
     機長 (Captain) 故事線
     基於 AA11 機長 John Ogonowski 改編
     ======================================== */
  captain: {
    role: '機長',
    roleEn: 'Captain',
    location: 'AA11 駕駛艙',
    startTime: '07:45',
    nodes: {
      'cap_start': {
        id: 'cap_start',
        speaker: '旁白',
        text: '你是美國航空11號班機的機長。今天是你例行的洛杉磯航線。你在波士頓洛根機場完成了起飛前檢查，副機長坐在你右邊。一切就緒。\n\n晨光從駕駛艙的擋風玻璃照進來，天氣晴朗——完美的飛行日。',
        timestamp: '07:45 AM',
        mood: 'calm',
        historicalNote: 'AA11 的機長是 John Ogonowski，52歲，退伍軍人，擁有超過23年的飛行經驗。他同時也是一位農場主，熱心幫助柬埔寨難民學習農耕。',
        choices: [
          { text: '與副機長確認飛行計畫', nextId: 'cap_preflight' },
          { text: '開始起飛程序', nextId: 'cap_preflight' }
        ]
      },
      'cap_preflight': {
        id: 'cap_preflight',
        speaker: '副機長',
        text: '「機長，所有系統正常。天氣報告顯示全程晴朗，預計飛行時間五小時三十分。乘客已全部登機，81位旅客，準備就緒。」\n\n你點點頭，推動油門桿。波音767開始在跑道上加速。',
        timestamp: '08:00 AM',
        mood: 'calm',
        next: 'cap_cruise'
      },
      'cap_cruise': {
        id: 'cap_cruise',
        speaker: '旁白',
        text: '飛機平穩爬升，窗外的波士頓港和大西洋海岸線逐漸縮小。你將飛機調整到巡航高度，開啟自動駕駛。\n\n航管的聲音在無線電裡傳來例行指令：「AA11，爬升至三五零。」\n\n一切如常。',
        timestamp: '08:13 AM',
        mood: 'calm',
        next: 'cap_noise'
      },
      'cap_noise': {
        id: 'cap_noise',
        speaker: '旁白',
        text: '你正準備回覆航管時，駕駛艙門後方傳來不尋常的聲響。\n\n是爭執聲？有什麼東西撞擊的聲音。然後——空服員緊急呼叫鈕亮了。',
        timestamp: '08:14 AM',
        mood: 'tense',
        choices: [
          { text: '先回覆航管，再查看情況', nextId: 'cap_reply_atc', consequence: 'procedural' },
          { text: '立即透過機內通訊聯繫空服員', nextId: 'cap_call_fa', consequence: 'concerned' },
          { text: '確認駕駛艙門已鎖定', nextId: 'cap_lock_door', consequence: 'cautious' }
        ]
      },
      'cap_reply_atc': {
        id: 'cap_reply_atc',
        speaker: '旁白',
        text: '你按下通訊鍵：「波士頓管制，AA11 收到，爬升至——」\n\n話還沒說完，駕駛艙門猛然被撞開。\n\n一切發生在數秒之內。',
        timestamp: '08:14 AM',
        mood: 'critical',
        next: 'cap_breach'
      },
      'cap_call_fa': {
        id: 'cap_call_fa',
        speaker: '旁白',
        text: '你按下機內通訊：「客艙，這裡是駕駛艙，什麼情況？」\n\n你聽到空服員急促的聲音：「機長！有人——」\n\n通訊突然中斷。然後，駕駛艙門被猛力撞開。',
        timestamp: '08:14 AM',
        mood: 'critical',
        next: 'cap_breach'
      },
      'cap_lock_door': {
        id: 'cap_lock_door',
        speaker: '旁白',
        text: '你本能地伸手確認駕駛艙門鎖——它是鎖上的。但在2001年，駕駛艙門的鎖並不是為了抵擋蓄意入侵而設計的。\n\n幾秒後，門鎖被強行撬開。',
        timestamp: '08:14 AM',
        mood: 'critical',
        historicalNote: '911之前，駕駛艙門並不具備強化防護功能。事件後，所有商用客機的駕駛艙門都被改造為防彈、加固設計，這是911帶來最重要的安全改革之一。',
        next: 'cap_breach'
      },
      'cap_breach': {
        id: 'cap_breach',
        speaker: '旁白',
        text: '闖入者衝進駕駛艙。在混亂中，你和副機長嘗試抵抗。\n\n這一刻，你作為機長能做的最後一件事——',
        timestamp: '08:15 AM',
        mood: 'critical',
        choices: [
          { text: '嘗試發送緊急代碼 7500（劫機）', nextId: 'cap_squawk', consequence: 'heroic' },
          { text: '按下通訊鍵，讓航管聽到駕駛艙的情況', nextId: 'cap_hot_mic', consequence: 'resourceful' },
          { text: '全力抵抗，保護駕駛艙', nextId: 'cap_resist', consequence: 'brave' }
        ]
      },
      'cap_squawk': {
        id: 'cap_squawk',
        speaker: '旁白',
        text: '你的手伸向應答機面板，試圖輸入7500——這是國際通用的劫機代碼。如果成功，地面會立刻知道這是劫機事件。\n\n但在你按下按鈕之前，應答機被關閉了。你的最後努力——成為了這場悲劇中無數未完成的掙扎之一。',
        timestamp: '08:21 AM',
        mood: 'critical',
        historicalNote: '應答機代碼 7500 代表劫機。7600 代表通訊故障，7700 代表緊急情況。AA11的應答機在08:21被關閉，航管員失去了詳細追蹤能力。',
        next: 'cap_final'
      },
      'cap_hot_mic': {
        id: 'cap_hot_mic',
        speaker: '旁白',
        text: '你用盡最後的力量按住通訊按鈕——讓地面的航管員能聽到駕駛艙裡正在發生的一切。\n\n這個看似微小的舉動，成為了地面理解真實情況的關鍵線索。',
        timestamp: '08:15 AM',
        mood: 'critical',
        historicalNote: '歷史上，正是因為劫機者意外啟動了通訊，航管員才聽到了駕駛艙內的情況。機組人員在極端壓力下的每一個動作，都為事後的理解和改革提供了線索。',
        next: 'cap_final'
      },
      'cap_resist': {
        id: 'cap_resist',
        speaker: '旁白',
        text: '你站起身來，用盡全力保護你的駕駛艙、你的飛機、你的乘客。\n\n作為一名退伍軍人和經驗豐富的機長，你從未想過會在自己的駕駛艙裡面臨這樣的戰鬥。但你選擇了戰鬥——直到最後一刻。',
        timestamp: '08:15 AM',
        mood: 'critical',
        next: 'cap_final'
      },
      'cap_final': {
        id: 'cap_final',
        speaker: '旁白',
        text: '在那個清朗的九月早晨，美國航空11號班機的駕駛艙裡，一位機長盡了他所有的力量。\n\n他叫 John Ogonowski。52歲。23年飛行經驗。一位父親，一位農夫，一位幫助難民的善良的人。\n\n他和機上其他91人一樣，在那天永遠離開了。但他們的故事不應被遺忘。',
        timestamp: '08:46 AM',
        mood: 'solemn',
        historicalNote: '機長 John Ogonowski 在他的馬薩諸塞州農場用業餘時間教導東南亞難民農耕技術。他的家人在他離世後繼續了這項公益事業。',
        isEnd: true,
        endTitle: '最後的守護',
        endDesc: '你體驗了 AA11 機長在生命最後時刻的視角。面對不可能的情境，他盡了身為機長的一切責任。911事件後，駕駛艙門安全標準被徹底改革。'
      }
    },
    nodeOrder: ['cap_start', 'cap_preflight', 'cap_cruise', 'cap_noise', 'cap_breach', 'cap_final']
  },

  /* ========================================
     空服員 (Flight Attendant) 故事線
     基於 Betty Ong 和 Amy Sweeney 真實事跡改編
     ======================================== */
  attendant: {
    role: '空服員',
    roleEn: 'Flight Attendant',
    location: 'AA11 客艙',
    startTime: '07:45',
    nodes: {
      'fa_start': {
        id: 'fa_start',
        speaker: '旁白',
        text: '你是美國航空11號班機的空服員。今天的班機從波士頓飛往洛杉磯，81位乘客已全部就坐。你和其他10位機組人員一起完成了安全示範。\n\n起飛後，你開始了例行的客艙服務——推著餐車穿過走道，對乘客微笑。',
        timestamp: '08:00 AM',
        mood: 'calm',
        historicalNote: 'AA11 上有11名機組人員，其中包括空服員 Betty Ong（45歲）和 Madeline Amy Sweeney（35歲）。她們在事件中的冷靜表現被後世視為英雄行為。',
        choices: [
          { text: '從經濟艙開始服務', nextId: 'fa_service' },
          { text: '先檢查商務艙的乘客', nextId: 'fa_service' }
        ]
      },
      'fa_service': {
        id: 'fa_service',
        speaker: '旁白',
        text: '飛機穩定在巡航高度。窗外是一片蔚藍。乘客們有的閱讀、有的闔眼休息、有的望向窗外。\n\n你注意到坐在前排的幾位男性乘客一直沒有碰他們的飲料。他們看起來很緊張，不斷交換眼神。\n\n但也許只是害怕飛行的旅客——你見過很多這樣的人。',
        timestamp: '08:10 AM',
        mood: 'calm',
        next: 'fa_disturbance'
      },
      'fa_disturbance': {
        id: 'fa_disturbance',
        speaker: '旁白',
        text: '突然，前方商務艙傳來尖叫聲。\n\n你轉頭看去——有人站了起來，走道上一片混亂。你看到同事急忙從前方跑了過來，臉色蒼白。\n\n「他們……他們闖進駕駛艙了……」她氣喘吁吁地說。',
        timestamp: '08:14 AM',
        mood: 'tense',
        choices: [
          { text: '立即用機上電話聯繫地面', nextId: 'fa_phone_ground', consequence: 'decisive' },
          { text: '嘗試前往查看駕駛艙情況', nextId: 'fa_go_front', consequence: 'brave' },
          { text: '先安撫乘客，維持秩序', nextId: 'fa_calm_passengers', consequence: 'composed' }
        ]
      },
      'fa_phone_ground': {
        id: 'fa_phone_ground',
        speaker: '旁白',
        text: '你快速走到機尾的服務區，拿起機上電話撥打美國航空的預約中心。你的手在發抖，但你的聲音保持鎮定。\n\n電話接通了。',
        timestamp: '08:19 AM',
        mood: 'tense',
        historicalNote: 'Betty Ong 在 08:19 使用機上電話撥通了美國航空預約中心，與地面人員 Nydia Gonzalez 通話約25分鐘。這通電話成為理解事件的關鍵記錄之一。',
        next: 'fa_call'
      },
      'fa_go_front': {
        id: 'fa_go_front',
        speaker: '旁白',
        text: '你沿著走道往前走。商務艙的乘客臉上寫滿了恐懼。前方的簾幕被拉上了。\n\n一位同事攔住你：「不要過去。駕駛艙門已經被……他們有刀。有兩個乘客受傷了。」\n\n你意識到——你能做的最重要的事，是讓地面知道正在發生什麼。你轉身走向機上電話。',
        timestamp: '08:17 AM',
        mood: 'critical',
        next: 'fa_call'
      },
      'fa_calm_passengers': {
        id: 'fa_calm_passengers',
        speaker: '旁白',
        text: '你用最平靜的語氣對周圍的乘客說：「各位旅客，請繫好安全帶，保持在座位上。我們正在處理情況。」\n\n有些乘客開始哭泣。一位母親緊緊抱住她的孩子。你在心中做了一個決定——你必須讓外界知道這裡發生了什麼。\n\n你走向機上電話。',
        timestamp: '08:18 AM',
        mood: 'tense',
        next: 'fa_call'
      },
      'fa_call': {
        id: 'fa_call',
        speaker: '你（空服員）',
        text: '電話接通。你深吸一口氣，盡可能冷靜地報告：\n\n「這裡是美國航空11號班機。飛機遭到劫持。我是編號三號的空服員。商務艙有乘客和機組人員受傷。劫機者進入了駕駛艙。我需要你們記錄——」',
        timestamp: '08:19 AM',
        mood: 'critical',
        historicalNote: 'Betty Ong 在通話中報告了劫機者的座位號碼（2A、2B、9A、9B、10B），受傷人員的情況，以及使用催淚噴霧等細節。這些資訊在事後成為了確認劫機者身份的關鍵證據。',
        next: 'fa_details'
      },
      'fa_details': {
        id: 'fa_details',
        speaker: '地面人員',
        text: '「收到。請告訴我劫機者的位置和人數。飛機現在的狀況如何？」\n\n你快速整理腦中的資訊。',
        timestamp: '08:21 AM',
        mood: 'critical',
        choices: [
          { text: '報告劫機者的座位號碼和特徵', nextId: 'fa_report_details', consequence: 'precise' },
          { text: '報告飛機的飛行異常和受傷人員', nextId: 'fa_report_flight', consequence: 'comprehensive' }
        ]
      },
      'fa_report_details': {
        id: 'fa_report_details',
        speaker: '你（空服員）',
        text: '「劫機者坐在2A、2B……和9A、9B。他們用了刀子，還有某種噴霧——可能是催淚瓦斯。前方有兩位乘客受傷，一位同事也傷了。他們已經控制了駕駛艙。」\n\n你的聲音在顫抖，但你堅持報告每一個你記得的細節。',
        timestamp: '08:22 AM',
        mood: 'critical',
        next: 'fa_ongoing'
      },
      'fa_report_flight': {
        id: 'fa_report_flight',
        speaker: '你（空服員）',
        text: '「飛機在下降。我不確定我們在哪裡，但高度一直在降低。機長和副機長沒有回應機內通訊。客艙裡有人受傷，需要急救。」\n\n你一邊報告，一邊透過窗戶往外看——地面越來越近。',
        timestamp: '08:22 AM',
        mood: 'critical',
        next: 'fa_ongoing'
      },
      'fa_ongoing': {
        id: 'fa_ongoing',
        speaker: '旁白',
        text: '你持續與地面保持通話，報告著你所看到的一切。同一時間，你的同事 Amy 也在另一部電話上與地面經理通話，提供更多資訊。\n\n你們兩個——在飛機上最後的清醒聲音——為地面提供了寶貴的即時情報。\n\n電話那頭的人在哭，但你沒有停下來。你知道每一秒的資訊都可能拯救其他人。',
        timestamp: '08:40 AM',
        mood: 'critical',
        historicalNote: '另一位空服員 Amy Sweeney 同時與地面經理 Michael Woodward 通話。她在最後時刻說出了：「我看到水面。我看到建築物。我看到建築物非常近……天啊。」',
        choices: [
          { text: '繼續保持通訊直到最後', nextId: 'fa_final', consequence: 'heroic' },
          { text: '安慰身邊的乘客，握住他們的手', nextId: 'fa_comfort_final', consequence: 'compassionate' }
        ]
      },
      'fa_final': {
        id: 'fa_final',
        speaker: '旁白',
        text: '你握著電話，一直到最後。\n\n你報告了你看到的一切——窗外的景色、飛機的高度、速度的感覺。你的聲音從未停止。\n\n在25分鐘的通話中，你提供了座位號碼、傷亡情報、飛行異常——這些資訊後來幫助了調查人員確認劫機者的身份，推動了全球航空安全的革新。',
        timestamp: '08:46 AM',
        mood: 'solemn',
        next: 'fa_end'
      },
      'fa_comfort_final': {
        id: 'fa_comfort_final',
        speaker: '旁白',
        text: '你放下電話，走向身邊的乘客。一位老太太在發抖，你握住她的手。一位年輕人在默默流淚，你輕輕拍了拍他的肩膀。\n\n在最後的時刻，你選擇不讓任何人獨自面對。\n\n作為空服員，你一直在做的事——照顧別人——你做到了最後。',
        timestamp: '08:46 AM',
        mood: 'solemn',
        next: 'fa_end'
      },
      'fa_end': {
        id: 'fa_end',
        speaker: '旁白',
        text: 'Betty Ong。45歲。在航空業服務了14年。\nAmy Sweeney。35歲。兩個孩子的母親。\n\n她們在那天展現的專業和勇氣，超越了任何訓練手冊所能教導的。她們的通話紀錄成為了理解911事件的關鍵證據，也推動了飛機通訊系統和安全程序的全面改革。\n\n她們是英雄。',
        timestamp: '',
        mood: 'solemn',
        historicalNote: 'Betty Ong 在2004年被追授為公共安全官員勳章。她的通話錄音在 911 委員會聽證會上播放，讓全場落淚。Betty 的姐姐後來說：「她做了她被訓練要做的事。」',
        isEnd: true,
        endTitle: '天空中的聲音',
        endDesc: '你體驗了空服員 Betty Ong 和 Amy Sweeney 的視角。她們在極端壓力下保持冷靜，為地面提供了關鍵情報。她們的勇氣改變了航空安全的歷史。'
      }
    },
    nodeOrder: ['fa_start', 'fa_service', 'fa_disturbance', 'fa_call', 'fa_details', 'fa_ongoing', 'fa_end']
  },

  /* ========================================
     教育反思資料
     ======================================== */
  education: {
    statistics: {
      totalVictims: '2,977',
      flightsHijacked: '4',
      countriesAffected: '90+',
      groundStopFlights: '4,546',
      safelyLanded: '4,546',
      firstResponders: '412',
      rescueWorkers: '數千名'
    },
    timeline: [
      { time: '07:59', event: 'AA11 從波士頓起飛' },
      { time: '08:14', event: 'AA11 最後一次正常通訊' },
      { time: '08:14', event: 'UA175 從波士頓起飛' },
      { time: '08:19', event: '空服員 Betty Ong 撥通地面電話' },
      { time: '08:20', event: 'AA77 從華盛頓杜勒斯起飛' },
      { time: '08:24', event: '劫機者通訊被航管員截獲' },
      { time: '08:42', event: 'UA93 從紐瓦克起飛' },
      { time: '08:46', event: 'AA11 撞擊世貿中心北塔' },
      { time: '09:03', event: 'UA175 撞擊世貿中心南塔' },
      { time: '09:37', event: 'AA77 撞擊五角大廈' },
      { time: '09:45', event: 'FAA 下令全美地面停飛' },
      { time: '09:59', event: '世貿中心南塔倒塌' },
      { time: '10:03', event: 'UA93 在賓州墜毀（乘客反擊）' },
      { time: '10:28', event: '世貿中心北塔倒塌' },
      { time: '12:15', event: '所有民航飛機完成降落' }
    ],
    reforms: [
      '駕駛艙門強化為防彈設計，並配備電子鎖',
      '成立運輸安全管理局（TSA），全面改革機場安檢',
      '禁止在客艙攜帶刀具及尖銳物品',
      '建立空中警察（Federal Air Marshal）計畫',
      '改進航管員與軍方的即時通訊系統',
      '強化航空器緊急通訊與追蹤技術',
      '建立國家反恐中心（NCTC）'
    ],
    memorialMessage: '我們記住那2,977個名字。我們記住那些在最黑暗的時刻展現出最耀眼勇氣的人——衝入火場的消防員、留在崗位的航管員、用生命傳遞資訊的空服員、在UA93上反擊的乘客。\n\n歷史不是為了重演恐懼，而是為了記住勇氣、理解脆弱、並永遠珍惜和平的可貴。'
  }
};
