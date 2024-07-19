import { useParams } from "react-router-dom"
import { useGetRestaurant } from "../api/RestaurantAPI";
import { AspectRatio } from "../components/ui/aspect-ratio";
import RestaurantInfo from "../components/RestaurantInfo";
import MenuItemComponent from "../components/MenuItem";
import { useState } from "react";
import { Card } from "../components/ui/card";
import OrderSummary from "../components/OrderSummary";
import { MenuItem } from "../types";

export type CartItem = {
    _id: string;
    name: string;
    price: number;
    quantity: number;
}

export default function DetailsPage() {
    const { restaurantId } = useParams();
    const { restaurant, isLoading } = useGetRestaurant(restaurantId);

    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    const addToCart = (menuItem: MenuItem) => {
        setCartItems((prevCartItems) => {
            const existingCartitem = prevCartItems.find((cartItem) => cartItem._id === menuItem._id);

            let updatedCartItems;

            if (existingCartitem) {
                updatedCartItems = prevCartItems.map((cartItem) =>
                    cartItem._id === menuItem._id
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                );
            }
            else {
                updatedCartItems = [
                    ...prevCartItems,
                    {
                        _id: menuItem._id,
                        name: menuItem.name,
                        price: menuItem.price,
                        quantity: 1
                    }
                ]
            }

            return updatedCartItems;
        });
    }

    const removeFromCart = (cartItem: CartItem) => {
        setCartItems((prevCartItems) => {
            const updatedCartItems = prevCartItems.filter((item)=>cartItem._id !== item._id);

            return updatedCartItems;
        });
    }

    if (isLoading || !restaurant) {
        return (
            <span>Loading...</span>
        )
    }

    return (
        <div className="flex flex-col gap-10">
            <AspectRatio ratio={16 / 5}>
                <img src={restaurant.imageUrl} className="rounded-md object-cover h-full w-full" />
            </AspectRatio>
            <div className="grid md:grid-cols-[4fr_2fr] gap-5 md:px-32">
                <div className="flex flex-col gap-4">
                    <RestaurantInfo restaurant={restaurant} />
                    <span className="text-2xl tracking-tight font-bold">Menu</span>
                    {restaurant.menuItems.map((item, index) => (
                        <MenuItemComponent menuItem={item} key={index} addToCart={() => addToCart(item)} />
                    ))}
                </div>

                <div>
                    <Card>
                        <OrderSummary restaurant={restaurant} cartItems={cartItems} removeFromCart={removeFromCart} />
                    </Card>
                </div>
            </div>
        </div>
    )
}
