# SO2_G12_1S2024

- Obtener Kernel

```
uname -r
```

- Descargar kernel

```
uname -r
```

```
get https://cdn.kernel.org/pub/linux/kernel/v5.x/linux-5.15.tar.gz
```

```
sudo apt-get install build-essential libncurses-dev bison flex libssl-dev libelf-dev
```

```
sudo apt-get install linux-headers-$(uname -r)
```

```
make menuconfig
```

```
make -j$(nproc)
```

