import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  Alert,
  FlatList,
  Modal,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { addLoad } from "../redux/store";
import { SQLiteService } from "../api/SQLiteService";

export function CreateLoadScreen({ navigation, route }) {
  const dispatch = useDispatch();
  const employee = useSelector((state) => state.auth.employee);

  const [warehouses, setWarehouses] = useState([]);
  const [skus, setSKUs] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [selectedSKUs, setSelectedSKUs] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const [showLoadTypeModal, setShowLoadTypeModal] = useState(false);
  const [loadType, setLoadType] = useState("Manual");
  const [showWarehouseModal, setShowWarehouseModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);

  useEffect(() => {
    const load = async () => {
      const w = await SQLiteService.getWarehouses();
      const s = await SQLiteService.getSKUs();
      setWarehouses(w);
      setSKUs(s);
      if (w.length > 0) setSelectedWarehouse(w[0]);
    };
    load();
  }, []);

  const filteredSKUs = skus.filter(
    (sku) =>
      sku.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sku.id.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const addSKU = (sku) => {
    setSelectedSKUs((prev) => ({
      ...prev,
      [sku.id]: { ...sku, quantity: prev[sku.id]?.quantity || 1 },
    }));
    setShowProductModal(false);
  };

  const updateQty = (skuId, qty) => {
    setSelectedSKUs((prev) => ({
      ...prev,
      [skuId]: { ...prev[skuId], quantity: Math.max(1, parseInt(qty) || 1) },
    }));
  };

  const removeSKU = (skuId) => {
    setSelectedSKUs((prev) => {
      const next = { ...prev };
      delete next[skuId];
      return next;
    });
  };

  const handleCreate = async () => {
    if (!selectedWarehouse) {
      Alert.alert("Error", "Select warehouse");
      return;
    }
    if (Object.keys(selectedSKUs).length === 0) {
      Alert.alert("Error", "Add products");
      return;
    }

    const uid = `load_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const lines = Object.values(selectedSKUs).map((sku) => ({
      sku_id: sku.id,
      quantity: sku.quantity,
      uom: sku.uom || "pcs",
    }));

    try {
      const load = await SQLiteService.createLoadRequest(
        uid,
        selectedWarehouse.id,
        employee?.id,
        lines,
      );
      dispatch(addLoad(load));
      Alert.alert("Success", "Load created & queued");
      navigation.goBack();
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Load Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Load From</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowLoadTypeModal(true)}
          >
            <Text style={styles.dropdownText}>
              {loadType === "Manual" ? "DISPATCH (WH-DIS-DAN)" : loadType}
            </Text>
            <Text style={styles.dropdownIcon}>▼</Text>
          </TouchableOpacity>
          <Text style={styles.dropdownHint}>Info icon here</Text>
        </View>

        {/* Warehouse Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Warehouse</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowWarehouseModal(true)}
          >
            <Text style={styles.dropdownText}>
              {selectedWarehouse?.name || "Select Warehouse"}
            </Text>
            <Text style={styles.dropdownIcon}>▼</Text>
          </TouchableOpacity>
        </View>

        {/* Product Search */}
        {selectedWarehouse && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Select Products</Text>
            <Text style={styles.productCount}>100 available</Text>

            <TouchableOpacity
              style={styles.searchInput}
              onPress={() => setShowProductModal(true)}
            >
              <Text style={styles.searchPlaceholder}>
                Search by SKU code or name...
              </Text>
            </TouchableOpacity>

            {/* Selected Products */}
            <View style={styles.selectedProducts}>
              {Object.values(selectedSKUs).length === 0 ? (
                <View style={styles.emptyProducts}>
                  <Text style={styles.emptyText}>No products added</Text>
                  <Text style={styles.emptyHint}>
                    Tap the + button to add products
                  </Text>
                </View>
              ) : (
                Object.values(selectedSKUs).map((sku) => (
                  <View key={sku.id} style={styles.productCard}>
                    <View style={styles.productCardTop}>
                      <View style={styles.productInfo}>
                        <Text style={styles.skuName}>{sku.name}</Text>
                        <Text style={styles.skuMeta}>{sku.uom} • Category</Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => removeSKU(sku.id)}
                        style={styles.removeBtn}
                      >
                        <Text style={styles.removeBtnText}>✕</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.qtyRow}>
                      <Text style={styles.qtyLabel}>
                        Volume not configured for PCS
                      </Text>
                      <View style={styles.qtyControl}>
                        <TextInput
                          style={styles.qtyInput}
                          value={String(sku.quantity)}
                          keyboardType="number-pad"
                          onChangeText={(val) => updateQty(sku.id, val)}
                        />
                      </View>
                    </View>
                  </View>
                ))
              )}
            </View>

            <TouchableOpacity
              style={styles.addProductBtn}
              onPress={() => setShowProductModal(true)}
            >
              <Text style={styles.addProductBtnText}>+ Add Product</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Confirm Button */}
      {selectedWarehouse && (
        <TouchableOpacity style={styles.confirmBtn} onPress={handleCreate}>
          <Text style={styles.confirmBtnText}>Confirm</Text>
        </TouchableOpacity>
      )}

      {/* Load Type Modal */}
      <Modal
        visible={showLoadTypeModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLoadTypeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Load Type</Text>
              <TouchableOpacity onPress={() => setShowLoadTypeModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.radioGroup}>
              {["Manual", "Auto", "ASRM Auto"].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={styles.radioOption}
                  onPress={() => {
                    setLoadType(type);
                    setShowLoadTypeModal(false);
                  }}
                >
                  <View
                    style={[
                      styles.radio,
                      loadType === type && styles.radioSelected,
                    ]}
                  >
                    {loadType === type && <View style={styles.radioDot} />}
                  </View>
                  <View style={styles.radioLabel}>
                    <Text style={styles.radioLabelText}>{type}</Text>
                    <Text style={styles.radioLabelSub}>
                      {type === "Manual" && "Enter quantities manually"}
                      {type === "Auto" && "Auto-calculate based on route"}
                      {type === "ASRM Auto" &&
                        "Auto-calculate using ASRM per-store"}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      {/* Warehouse Modal */}
      <Modal
        visible={showWarehouseModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowWarehouseModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentFull}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Warehouse</Text>
              <TouchableOpacity onPress={() => setShowWarehouseModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={warehouses}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.listItem}
                  onPress={() => {
                    setSelectedWarehouse(item);
                    setShowWarehouseModal(false);
                  }}
                >
                  <Text style={styles.listItemText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Product Picker Modal */}
      <Modal
        visible={showProductModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowProductModal(false)}
      >
        <View style={styles.container}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowProductModal(false)}>
              <Text style={styles.backText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select Products</Text>
            <TouchableOpacity onPress={() => setShowProductModal(false)}>
              <Text style={styles.modalClose}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput2}
              placeholder="Search by SKU code or name..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <Text style={styles.productListLabel}>
            ALL ITEMS • {filteredSKUs.length}
          </Text>

          <FlatList
            data={filteredSKUs}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.productListItem}
                onPress={() => addSKU(item)}
              >
                <View style={styles.productListInfo}>
                  <Text style={styles.productListName}>{item.name}</Text>
                  <Text style={styles.productListCategory}>
                    {item.uom} • Category
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.productListContent}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dropdownText: {
    fontSize: 13,
    color: "#333",
    fontWeight: "500",
  },
  dropdownIcon: {
    fontSize: 12,
    color: "#999",
  },
  dropdownHint: {
    fontSize: 11,
    color: "#999",
    marginTop: 4,
  },
  productCount: {
    fontSize: 11,
    color: "#999",
    marginBottom: 8,
  },
  searchInput: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  searchPlaceholder: {
    fontSize: 13,
    color: "#999",
  },
  selectedProducts: {
    marginBottom: 12,
  },
  emptyProducts: {
    backgroundColor: "#fff",
    borderRadius: 6,
    paddingVertical: 40,
    alignItems: "center",
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 13,
    color: "#999",
    fontWeight: "500",
  },
  emptyHint: {
    fontSize: 12,
    color: "#ccc",
    marginTop: 4,
  },
  productCard: {
    backgroundColor: "#fff",
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
  },
  productCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  productInfo: {
    flex: 1,
  },
  skuName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  skuMeta: {
    fontSize: 11,
    color: "#999",
  },
  removeBtn: {
    padding: 4,
  },
  removeBtnText: {
    fontSize: 16,
    color: "#FF3B30",
  },
  qtyRow: {
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 8,
  },
  qtyLabel: {
    fontSize: 11,
    color: "#999",
    marginBottom: 6,
  },
  qtyControl: {
    flexDirection: "row",
    alignItems: "center",
  },
  qtyInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    width: 50,
    fontSize: 12,
    textAlign: "center",
  },
  addProductBtn: {
    backgroundColor: "#004B87",
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 100,
  },
  addProductBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },
  confirmBtn: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#004B87",
    paddingVertical: 16,
    alignItems: "center",
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 6,
  },
  confirmBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 24,
    padding: 16,
  },
  modalContentFull: {
    flex: 1,
    backgroundColor: "#fff",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    textAlign: "center",
  },
  modalClose: {
    fontSize: 20,
    color: "#999",
  },
  backText: {
    fontSize: 20,
    color: "#004B87",
  },
  radioGroup: {
    gap: 12,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 6,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ddd",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  radioSelected: {
    borderColor: "#004B87",
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#004B87",
  },
  radioLabel: {
    flex: 1,
  },
  radioLabelText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  radioLabelSub: {
    fontSize: 12,
    color: "#999",
  },
  listItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  listItemText: {
    fontSize: 13,
    color: "#333",
  },
  searchContainer: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  searchInput2: {
    backgroundColor: "#f5f5f5",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
  },
  productListLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#999",
    paddingHorizontal: 12,
    paddingVertical: 8,
    textTransform: "uppercase",
  },
  productListContent: {
    paddingHorizontal: 12,
  },
  productListItem: {
    backgroundColor: "#fff",
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#004B87",
  },
  productListInfo: {
    flex: 1,
  },
  productListName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  productListCategory: {
    fontSize: 11,
    color: "#999",
  },
});
