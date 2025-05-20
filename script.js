// 游戏数据
const gameData = {
    flips: 0,
    firstCard: null,
    secondCard: null,
    lockBoard: false,
    matchedPairs: 0,
    totalPairs: 8
};

// 卡片内容数组，包含新华网络协会和陈力湧相关的搞笑元素
const cardContents = [
    { emoji: '💻', text: '编程' },
    { emoji: '🌐', text: '网络' },
    { emoji: '🔍', text: '探索' },
    { emoji: '🚀', text: '创新' },
    { emoji: '📱', text: '科技' },
    { emoji: '🎮', text: '游戏' },
    { emoji: '🤣', text: '陈力湧的笑话' },
    { emoji: '🏆', text: '协会荣誉' }
];

// 搞笑提示语数组
const funnyMessages = [
    '陈力湧说：这个配对太简单了！',
    '新华网协提醒：多喝热水有助于记忆力！',
    '听说找到所有配对的人都变帅了！',
    '陈力湧曾经30秒内完成了这个游戏，你能超越吗？',
    '新华网协成员都是靠这个游戏训练的！',
    '据说玩这个游戏可以提高编程能力...',
    '陈力湧：别担心，我第一次也花了很久...',
    '提示：记忆力和发量成反比！'
];

// DOM 元素
const gameBoard = document.getElementById('game-board');
const flipsCounter = document.getElementById('flips');
const restartButton = document.getElementById('restart-button');
const successModal = document.getElementById('success-modal');
const finalFlips = document.getElementById('final-flips');
const playAgainButton = document.getElementById('play-again');

// 初始化游戏
function initGame() {
    // 重置游戏数据
    gameData.flips = 0;
    gameData.firstCard = null;
    gameData.secondCard = null;
    gameData.lockBoard = false;
    gameData.matchedPairs = 0;
    
    // 更新翻牌计数器显示
    flipsCounter.textContent = gameData.flips;
    
    // 清空游戏板
    gameBoard.innerHTML = '';
    
    // 创建卡片对（每个内容两张卡片）
    const cardPairs = [...cardContents, ...cardContents];
    
    // 随机打乱卡片顺序
    const shuffledCards = shuffleArray(cardPairs);
    
    // 创建卡片元素并添加到游戏板
    shuffledCards.forEach((card, index) => {
        const cardElement = createCardElement(card, index);
        gameBoard.appendChild(cardElement);
    });
    
    // 显示随机搞笑提示
    showRandomFunnyMessage();
}

// 创建卡片元素
function createCardElement(card, index) {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.dataset.index = index;
    
    // 卡片正面（图案面）
    const cardFront = document.createElement('div');
    cardFront.classList.add('card-face', 'card-front');
    cardFront.innerHTML = `${card.emoji}<br><small>${card.text}</small>`;
    
    // 卡片背面
    const cardBack = document.createElement('div');
    cardBack.classList.add('card-face', 'card-back');
    
    // 将正反面添加到卡片元素
    cardElement.appendChild(cardFront);
    cardElement.appendChild(cardBack);
    
    // 添加点击事件
    cardElement.addEventListener('click', flipCard);
    
    return cardElement;
}

// 翻转卡片
function flipCard() {
    // 如果游戏板锁定或点击了已经翻开的卡片，则不执行操作
    if (gameData.lockBoard || this === gameData.firstCard) return;
    
    // 如果卡片已经匹配，则不执行操作
    if (this.classList.contains('matched')) return;
    
    // 翻转卡片
    this.classList.add('flipped');
    
    // 增加翻牌次数
    gameData.flips++;
    flipsCounter.textContent = gameData.flips;
    
    // 判断是第一张还是第二张卡片
    if (!gameData.firstCard) {
        // 第一张卡片
        gameData.firstCard = this;
        return;
    }
    
    // 第二张卡片
    gameData.secondCard = this;
    
    // 检查是否匹配
    checkForMatch();
}

// 检查卡片是否匹配
function checkForMatch() {
    // 锁定游戏板，防止用户在检查过程中点击其他卡片
    gameData.lockBoard = true;
    
    // 获取两张卡片的索引
    const firstCardIndex = gameData.firstCard.dataset.index % cardContents.length;
    const secondCardIndex = gameData.secondCard.dataset.index % cardContents.length;
    
    // 判断是否匹配
    const isMatch = firstCardIndex === secondCardIndex;
    
    if (isMatch) {
        // 匹配成功
        disableCards();
        gameData.matchedPairs++;
        
        // 检查是否完成所有匹配
        if (gameData.matchedPairs === gameData.totalPairs) {
            setTimeout(() => {
                showSuccessModal();
            }, 1000);
        } else {
            // 解锁游戏板
            gameData.lockBoard = false;
        }
    } else {
        // 不匹配，翻回卡片
        unflipCards();
    }
}

// 禁用已匹配的卡片
function disableCards() {
    gameData.firstCard.classList.add('matched');
    gameData.secondCard.classList.add('matched');
    
    // 重置卡片选择
    resetBoard();
}

// 翻回不匹配的卡片
function unflipCards() {
    setTimeout(() => {
        gameData.firstCard.classList.remove('flipped');
        gameData.secondCard.classList.remove('flipped');
        
        // 重置卡片选择
        resetBoard();
    }, 1000);
}

// 重置游戏板状态
function resetBoard() {
    gameData.firstCard = null;
    gameData.secondCard = null;
    gameData.lockBoard = false;
}

// 显示成功弹窗
function showSuccessModal() {
    finalFlips.textContent = gameData.flips;
    successModal.classList.add('show');
}

// 显示随机搞笑提示
function showRandomFunnyMessage() {
    const randomIndex = Math.floor(Math.random() * funnyMessages.length);
    const message = funnyMessages[randomIndex];
    
    // 创建提示元素
    const tipElement = document.createElement('div');
    tipElement.classList.add('funny-tip');
    tipElement.textContent = message;
    tipElement.style.cssText = `
        background-color: #fffacd;
        padding: 10px;
        border-radius: 5px;
        margin-bottom: 15px;
        text-align: center;
        font-style: italic;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    `;
    
    // 添加到游戏信息区域前面
    const gameInfo = document.querySelector('.game-info');
    gameInfo.parentNode.insertBefore(tipElement, gameInfo);
    
    // 5秒后自动消失
    setTimeout(() => {
        tipElement.style.opacity = '0';
        tipElement.style.transition = 'opacity 0.5s';
        
        setTimeout(() => {
            if (tipElement.parentNode) {
                tipElement.parentNode.removeChild(tipElement);
            }
        }, 500);
    }, 5000);
}

// 打乱数组顺序（Fisher-Yates 洗牌算法）
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// 事件监听器
restartButton.addEventListener('click', initGame);
playAgainButton.addEventListener('click', () => {
    successModal.classList.remove('show');
    initGame();
});

// 初始化游戏
document.addEventListener('DOMContentLoaded', initGame); 