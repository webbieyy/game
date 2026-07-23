/* ============================================================
   Story Engine - 決策樹敘事引擎
   ============================================================ */
window.Game = window.Game || {};

Game.StoryEngine = class StoryEngine {
  constructor() {
    this.currentStory = null;
    this.currentNodeId = null;
    this.choices = [];
    this.isTyping = false;
    this.typewriterTimer = null;
    this.timerInterval = null;
    this.timerRemaining = 0;
    this.onNodeChange = null;
    this.onStoryEnd = null;
    this.onChoicesPresented = null;
    this.charIndex = 0;
    this.fullText = '';
  }

  loadStory(roleKey) {
    const data = Game.StoryData[roleKey];
    if (!data) return false;
    this.currentStory = data;
    this.choices = [];
    this.currentNodeId = null;
    return true;
  }

  start() {
    if (!this.currentStory) return;
    const firstNodeId = this.currentStory.nodeOrder[0];
    this.goToNode(firstNodeId);
  }

  goToNode(nodeId) {
    if (!this.currentStory) return;
    const node = this.currentStory.nodes[nodeId];
    if (!node) return;

    this.currentNodeId = nodeId;
    this.stopTimer();

    if (this.onNodeChange) {
      this.onNodeChange(node);
    }

    // Start typewriter
    this.startTypewriter(node.text, () => {
      if (node.isEnd) {
        if (this.onStoryEnd) this.onStoryEnd(node);
      } else if (node.choices) {
        if (this.onChoicesPresented) this.onChoicesPresented(node.choices);
      }
    });
  }

  startTypewriter(text, onComplete) {
    this.isTyping = true;
    this.fullText = text;
    this.charIndex = 0;

    const dialogText = document.getElementById('dialog-text');
    if (!dialogText) return;
    dialogText.innerHTML = '';

    clearInterval(this.typewriterTimer);
    this.typewriterTimer = setInterval(() => {
      if (this.charIndex < this.fullText.length) {
        const char = this.fullText[this.charIndex];
        if (char === '\n') {
          dialogText.innerHTML += '<br>';
        } else {
          dialogText.innerHTML += char;
        }
        this.charIndex++;
      } else {
        clearInterval(this.typewriterTimer);
        this.isTyping = false;
        if (onComplete) onComplete();
      }
    }, 30);
  }

  skipTypewriter() {
    if (!this.isTyping) return false;
    clearInterval(this.typewriterTimer);
    this.isTyping = false;

    const dialogText = document.getElementById('dialog-text');
    if (dialogText) {
      dialogText.innerHTML = this.fullText.replace(/\n/g, '<br>');
    }

    const node = this.currentStory.nodes[this.currentNodeId];
    if (node) {
      if (node.isEnd) {
        if (this.onStoryEnd) this.onStoryEnd(node);
      } else if (node.choices) {
        if (this.onChoicesPresented) this.onChoicesPresented(node.choices);
      }
    }
    return true;
  }

  selectChoice(index) {
    const node = this.currentStory.nodes[this.currentNodeId];
    if (!node || !node.choices || !node.choices[index]) return;

    const choice = node.choices[index];
    this.choices.push({
      nodeId: this.currentNodeId,
      choiceIndex: index,
      choiceText: choice.text,
      consequence: choice.consequence || ''
    });

    this.stopTimer();
    this.goToNode(choice.nextId);
  }

  advanceToNext() {
    const node = this.currentStory.nodes[this.currentNodeId];
    if (!node || !node.next) return false;
    this.goToNode(node.next);
    return true;
  }

  getCurrentNode() {
    if (!this.currentStory || !this.currentNodeId) return null;
    return this.currentStory.nodes[this.currentNodeId];
  }

  startTimer(seconds, onTimeout) {
    this.timerRemaining = seconds;
    const timerEl = document.querySelector('.dialog-timer');
    const fillEl = document.querySelector('.dialog-timer-fill');
    if (timerEl) timerEl.classList.add('active');

    this.timerInterval = setInterval(() => {
      this.timerRemaining -= 0.1;
      if (fillEl) {
        fillEl.style.width = `${(this.timerRemaining / seconds) * 100}%`;
      }
      if (this.timerRemaining <= 0) {
        this.stopTimer();
        if (onTimeout) onTimeout();
      }
    }, 100);
  }

  stopTimer() {
    clearInterval(this.timerInterval);
    this.timerRemaining = 0;
    const timerEl = document.querySelector('.dialog-timer');
    if (timerEl) timerEl.classList.remove('active');
  }

  getChoicesSummary() {
    return this.choices.map(c => ({
      text: c.choiceText,
      consequence: c.consequence
    }));
  }

  destroy() {
    clearInterval(this.typewriterTimer);
    this.stopTimer();
    this.currentStory = null;
    this.currentNodeId = null;
    this.choices = [];
  }
};
