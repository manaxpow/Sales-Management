import React from "react";
import { useParams } from "react-router-dom";
import ProductDetail from "../components/product/detailproduct/product-detail.tsx";
import ProductListCart from "../components/product/detailproduct/product-list-card.component.tsx";
import ExclusiveCard from "../components/product/detailproduct/exclusive-card.tsx";
import RelatedProducts from "../components/product/detailproduct/related-products.tsx";

const ProductDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    return (
        <div className="min-h-screen py-10">
            <div className="container mx-auto grid grid-cols-1 lg:grid-cols-10 gap-6 px-[140px]">
                <div className="lg:col-span-7 px-4">
                    <ProductDetail productId={id} />
                </div>
                <div className="lg:col-span-3 flex flex-col gap-6">
                    <div className="grid grid-rows-2 w-full h-full gap-6 px-4 items-center">
                        <ExclusiveCard />
                        <ProductListCart title="Sản phẩm nổi bật" limit={5} />
                    </div>

                </div>
            </div>
            <div className="container">
                <RelatedProducts />
            </div>

        </div>
    );
};

export default ProductDetailPage;
