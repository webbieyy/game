/* ============================================================
   Memorial Module - 紀念與教育模組
   ============================================================ */
window.Game = window.Game || {};

Game.Memorial = class Memorial {
  constructor() {
    this.isVisible = false;
  }

  show(container, choicesSummary, endData) {
    this.isVisible = true;
    const edu = Game.StoryData.education;

    container.innerHTML = `
      <div class="reflection-container">
        <div class="reflection-header">
          <div class="reflection-chapter">CHAPTER END</div>
          <h1 class="reflection-title">${endData?.endTitle || '故事結束'}</h1>
          <p style="color: var(--text-secondary); font-size: 15px; line-height: 1.7;">
            ${endData?.endDesc || ''}
          </p>
        </div>

        ${choicesSummary && choicesSummary.length > 0 ? `
        <div class="reflection-choices-summary">
          <div class="reflection-choices-title">📋 你的決策回顧</div>
          ${choicesSummary.map(c => `
            <div class="reflection-choice-item">
              <div class="choice-marker"></div>
              <div>
                <div style="color: var(--text-primary); margin-bottom: 2px;">${c.text}</div>
                ${c.consequence ? `<div style="font-size: 12px; color: var(--accent-blue);">— ${this._getConsequenceLabel(c.consequence)}</div>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
        ` : ''}

        <div class="reflection-stat-grid">
          <div class="reflection-stat">
            <div class="reflection-stat-value">${edu.statistics.totalVictims}</div>
            <div class="reflection-stat-label">罹難人數</div>
          </div>
          <div class="reflection-stat">
            <div class="reflection-stat-value">${edu.statistics.flightsHijacked}</div>
            <div class="reflection-stat-label">被劫持航班</div>
          </div>
          <div class="reflection-stat">
            <div class="reflection-stat-value">${edu.statistics.firstResponders}</div>
            <div class="reflection-stat-label">殉職急救人員</div>
          </div>
          <div class="reflection-stat">
            <div class="reflection-stat-value">${edu.statistics.groundStopFlights}</div>
            <div class="reflection-stat-label">安全引導降落航班</div>
          </div>
        </div>

        <div class="reflection-actions">
          <button class="btn btn-primary" id="btn-go-memorial" style="margin-bottom: var(--space-md);">
            🕯️ 前往紀念牆
          </button>
          <button class="btn btn-secondary" id="btn-play-another">
            選擇其他角色
          </button>
        </div>
      </div>
    `;
  }

  showMemorialWall(container) {
    const edu = Game.StoryData.education;

    container.innerHTML = `
      <div class="memorial-container">
        <div class="memorial-flame">🕯️</div>
        <h1 class="memorial-title">永遠銘記</h1>
        <p class="memorial-subtitle">In Memory of September 11, 2001</p>

        <div class="memorial-stats">
          <div class="memorial-stat-card">
            <div class="memorial-stat-number">${edu.statistics.totalVictims}</div>
            <div class="memorial-stat-desc">無辜生命在這天永遠離開了我們</div>
          </div>
          <div class="memorial-stat-card">
            <div class="memorial-stat-number">${edu.statistics.firstResponders}</div>
            <div class="memorial-stat-desc">消防員、警察和急救人員在救援中殉職</div>
          </div>
          <div class="memorial-stat-card">
            <div class="memorial-stat-number">${edu.statistics.countriesAffected}</div>
            <div class="memorial-stat-desc">個國家的公民在事件中罹難</div>
          </div>
        </div>

        <div class="memorial-timeline">
          <h2 class="timeline-title">事件時間線</h2>
          ${edu.timeline.map(item => `
            <div class="timeline-item">
              <div class="timeline-time">${item.time}</div>
              <div class="timeline-content">${item.event}</div>
            </div>
          `).join('')}
        </div>

        <div style="text-align: left; margin-bottom: var(--space-2xl);">
          <h2 class="timeline-title">事件後的安全改革</h2>
          <div style="padding: 0 var(--space-lg);">
            ${edu.reforms.map(r => `
              <div style="display: flex; align-items: flex-start; gap: var(--space-sm); padding: var(--space-sm) 0; font-size: 14px; color: var(--text-secondary);">
                <span style="color: var(--accent-gold); flex-shrink: 0;">✦</span>
                <span>${r}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="memorial-message">
          ${edu.memorialMessage.replace(/\n/g, '<br><br>')}
        </div>

        <div style="text-align: center; margin-bottom: var(--space-xl);">
          <div style="font-size: 14px; color: var(--text-dim); margin-bottom: var(--space-md);">
            資料來源：9/11 Commission Report、National September 11 Memorial & Museum、FAA 官方紀錄
          </div>
        </div>

        <div class="memorial-actions">
          <button class="btn btn-primary" id="btn-back-menu">
            返回主選單
          </button>
          <button class="btn btn-secondary" id="btn-play-again">
            選擇其他角色
          </button>
        </div>
      </div>
    `;
  }

  _getConsequenceLabel(consequence) {
    const labels = {
      thorough: '謹慎周全',
      proactive: '主動積極',
      cautious: '穩健保守',
      decisive: '果斷決策',
      focused: '專注執行',
      resourceful: '靈活應變',
      heroic: '英勇無畏',
      strategic: '策略思考',
      procedural: '依規行事',
      concerned: '關心他人',
      brave: '勇於面對',
      precise: '精準報告',
      comprehensive: '全面掌握',
      compassionate: '溫暖關懷',
      composed: '沉著冷靜'
    };
    return labels[consequence] || consequence;
  }

  destroy() {
    this.isVisible = false;
  }
};
