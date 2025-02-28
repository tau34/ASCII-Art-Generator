//JSONデータを読み込む
fetch('intensity_data.json')
    .then(response => response.json())
    .then(data => {
        intensityData = data;
    })
    .catch(error => console.error('濃淡データの読み込みエラー:', error));

// 二分探索を使って最適な文字を探す
function getAsciiChar(grayValue) {
    let low = 0;
    let high = intensityData.length - 1;

    // 二分探索
    while (low <= high) {
        let mid = Math.floor((low + high) / 2);
        if (intensityData[mid][0] === grayValue) {
            return intensityData[mid][1];
        } else if (intensityData[mid][0] < grayValue) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }

    // 最も近い濃淡の文字を返す
    return intensityData[low] ? intensityData[low][1] : ' ';
}

document.getElementById('imageUpload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.src = e.target.result;
        img.onload = function() {
            const canvas = document.getElementById('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0, img.width, img.height);
            const imageData = ctx.getImageData(0, 0, img.width, img.height).data;

            let asciiArt = "";
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const i = (y * width + x) * 4;
                    const gray = (imageData[i] + imageData[i + 1] + imageData[i + 2]) / 3;
                    asciiArt += getAsciiChar(gray / 4.83226692945 + 201.774658203125);
                }
                asciiArt += "\n";
            }

            document.getElementById('asciiArt').textContent = asciiArt;
        };
    };
    reader.readAsDataURL(file);
});

// ダウンロード機能
document.getElementById('downloadBtn').addEventListener('click', function() {
    const asciiArt = document.getElementById('asciiArt').textContent;
    const blob = new Blob([asciiArt], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "ascii_art.txt";
    link.click();
});
