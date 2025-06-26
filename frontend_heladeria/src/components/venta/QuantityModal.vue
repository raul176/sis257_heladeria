<template>
    <Dialog v-model:visible="isVisible" :style="{ width: '450px' }" header="Cantidad del producto" :modal="true"
        @update:visible="$emit('update:visible', $event)" class="quantity-dialog">
        <div class="quantity-modal" v-if="product">
            <div class="product-preview">
                <div class="product-icon">
                    <i class="pi pi-box"></i>
                </div>
                <div class="product-info">
                    <h3>{{ product.nombre }}</h3>
                    <p class="price">{{ product.precio }} Bs c/u</p>
                    <p class="stock" :class="{ 'low-stock': maxQuantity <= 5 }">
                        Stock disponible: {{ maxQuantity }}
                    </p>
                </div>
            </div>

            <div class="quantity-selector">
                <label>Selecciona la cantidad:</label>
                <div class="quantity-input">
                    <Button icon="pi pi-minus" @click="decrementQuantity" :disabled="quantity <= 1" 
                            class="quantity-btn minus-btn" />
                    <InputNumber v-model="quantity" :min="1" :max="maxQuantity" :showButtons="false" 
                                class="quantity-field" />
                    <Button icon="pi pi-plus" @click="incrementQuantity" :disabled="quantity >= maxQuantity" 
                            class="quantity-btn plus-btn" />
                </div>
                <div class="total-preview">
                    Total: <span class="total-amount">{{ (quantity * product.precio).toFixed(2) }} Bs</span>
                </div>
            </div>

            <div class="modal-actions">
                <Button label="Cancelar" class="p-button-text cancel-btn" @click="closeModal" />
                <Button label="Agregar al carrito" class="add-btn" @click="confirmAddProduct" 
                        icon="pi pi-shopping-cart" />
            </div>
        </div>
    </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
import Dialog from 'primevue/dialog'

// Props
interface Product {
    id: number
    nombre: string
    precio: number
    stock: number
}

interface Props {
    visible: boolean
    product: Product | null
    cartItems?: Array<{ producto: Product; cantidad: number }>
}

const props = withDefaults(defineProps<Props>(), {
    cartItems: () => []
})

// Emits
const emit = defineEmits<{
    'update:visible': [value: boolean]
    'confirm': [product: Product, quantity: number]
    'close': []
}>()

// Reactive data
const quantity = ref(1)

// Computed
const isVisible = computed({
    get: () => props.visible,
    set: (value) => emit('update:visible', value)
})

const maxQuantity = computed(() => {
    if (!props.product) return 1

    const existingItem = props.cartItems.find(
        item => item.producto.id === props.product?.id
    )
    const quantityInCart = existingItem ? existingItem.cantidad : 0
    return (props.product.stock || 0) - quantityInCart
})

// Methods
function incrementQuantity() {
    if (quantity.value < maxQuantity.value) {
        quantity.value++
    }
}

function decrementQuantity() {
    if (quantity.value > 1) {
        quantity.value--
    }
}

function confirmAddProduct() {
    if (props.product && quantity.value > 0) {
        emit('confirm', props.product, quantity.value)
        closeModal()
    }
}

function closeModal() {
    emit('close')
    emit('update:visible', false)
}

// Watch for product changes to reset quantity
watch(() => props.product, (newProduct) => {
    if (newProduct) {
        quantity.value = 1
    }
})

// Watch for visible changes to reset quantity
watch(() => props.visible, (newVisible) => {
    if (newVisible && props.product) {
        quantity.value = 1
    }
})
</script>

<style scoped>
/* Estilos del modal principal */
:deep(.quantity-dialog .p-dialog-header) {
    background: linear-gradient(135deg, #e0f7fa 0%, #f0f4ff 100%);
    color: #00bcd4;
    border-radius: 18px 18px 0 0;
    font-weight: 700;
}

:deep(.quantity-dialog .p-dialog-content) {
    border-radius: 0 0 18px 18px;
    padding: 24px;
}

.quantity-modal {
    font-family: 'Nunito', 'Segoe UI', Arial, sans-serif;
}

.product-preview {
    background: #f0f4ff;
    border-radius: 14px;
    padding: 18px;
    margin-bottom: 20px;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.04);
    display: flex;
    align-items: center;
    gap: 16px;
}

.product-icon {
    background: #e0f7fa;
    border-radius: 50%;
    width: 52px;
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.8rem;
    color: #00bcd4;
}

.product-info {
    flex: 1;
}

.product-info h3 {
    margin: 0 0 6px 0;
    color: #3b3b3b;
    font-size: 1.2rem;
    font-weight: 700;
}

.price {
    margin: 4px 0;
    color: #00bcd4;
    font-weight: 600;
    font-size: 1.05rem;
}

.stock {
    margin: 4px 0;
    color: #6c757d;
    font-size: 0.95rem;
}

.stock.low-stock {
    color: #ff9800;
    font-weight: 700;
}

.quantity-selector {
    margin-bottom: 20px;
}

.quantity-selector label {
    display: block;
    margin-bottom: 10px;
    font-weight: 600;
    color: #3b3b3b;
    font-size: 1.05rem;
}

.quantity-input {
    display: flex;
    align-items: center;
    gap: 12px;
    justify-content: center;
    background: #f6faff;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 12px;
}

.quantity-btn {
    background: #e0f7fa !important;
    color: #00bcd4 !important;
    border: 2px solid #b2ebf2 !important;
    border-radius: 50% !important;
    width: 36px !important;
    height: 36px !important;
    font-size: 1.2em !important;
    transition: all 0.2s;
}

.quantity-btn:hover {
    background: #b2ebf2 !important;
    transform: scale(1.1);
}

.quantity-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
}

.quantity-field {
    width: 14vw;
    text-align: center;
    font-size: 1.1rem;
    font-weight: 700;
}

.total-preview {
    text-align: center;
    font-size: 1.1rem;
    color: #3b3b3b;
    font-weight: 600;
}

.total-amount {
    color: #43a047;
    font-weight: 700;
    font-size: 1.2rem;
}

.modal-actions {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    padding-top: 16px;
    border-top: 2px solid #f0f4ff;
}

.cancel-btn {
    color: #6c757d !important;
    font-weight: 600;
}

.cancel-btn:hover {
    color: #3b3b3b !important;
}

.add-btn {
    background: linear-gradient(90deg, #00bcd4 0%, #43e97b 100%) !important;
    color: #fff !important;
    border: none !important;
    font-weight: 700;
    border-radius: 8px;
    padding: 10px 20px;
    box-shadow: 0 2px 8px 0 rgba(0, 188, 212, 0.15);
    transition: all 0.2s;
}

.add-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px 0 rgba(0, 188, 212, 0.25);
}

.add-btn:disabled {
    background: #b2ebf2 !important;
    color: #fff !important;
    cursor: not-allowed;
    transform: none !important;
}
</style>