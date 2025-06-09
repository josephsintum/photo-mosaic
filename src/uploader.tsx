import { createSignal } from "solid-js";

function Uploader(props: { setImage: Function; }) {

	const setImage = props.setImage;

	const [dragOver, setDragOver] = createSignal(false);
	let fileInputRef;

	const handleFileSelect = (file) => {
		if (file && file.type.startsWith('image/')) {
			const reader = new FileReader();
			reader.onload = (e) => {
				const img = new Image();
				img.onload = () => {
					setImage(img);
				};
				img.src = e.target.result;
			};
			reader.readAsDataURL(file);
		}
	};

	const handleDrop = (e) => {
		e.preventDefault();
		setDragOver(false);
		const files = e.dataTransfer.files;
		if (files.length > 0) {
			handleFileSelect(files[0]);
		}
	};

	const handleDragOver = (e) => {
		e.preventDefault();
		setDragOver(true);
	};

	const handleDragLeave = (e) => {
		e.preventDefault();
		setDragOver(false);
	};c

	return <div
		class={`upload-zone ${dragOver() ? 'drag-over' : ''}`}
		onClick={() => fileInputRef.click()}
		onDrop={handleDrop}
		onDragOver={handleDragOver}
		onDragLeave={handleDragLeave}
	>
		<div class="upload-icon">📸</div>
		<div class="upload-text">Click to upload or drag & drop an image</div>
		<div>Supports JPG, PNG, GIF formats</div>
		<input
			ref={fileInputRef}
			type="file"
			class="upload-input"
			accept="image/*"
			onChange={(e) => handleFileSelect(e.target.files[0])}
		/>
	</div>

}

export default Uploader;